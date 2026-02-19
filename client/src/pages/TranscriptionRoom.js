//css goes here
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

function TranscriptionRoom() {
    const [username, setUsername] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [transcriptionText, setTranscriptionText] = useState('');
    const [error, setError] = useState('');
    const [loading, isLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const recognitionRef = useRef(null);
    const { roomId, roomName } = location.state || {};

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if(user) {
            setUsername(user.username);
        }
        //connecting to socket goes here
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        newSocket.emit('join-room', roomId, user.username);
        newSocket.on('receive-transcription', (data) => {
            setTranscriptionText(prev => 
                `${prev}\n[${data.username}]: ${data.text}`
            );
        });
        newSocket.on('user-joined', (username) => {
            console.log(`${username} joined the room`);
        });
        newSocket.on('user-left', (username) => {
            console.log(`${username} left the room`);
        });
        return () => {
            if(recognitionRef.current) {
                recognitionRef.current.stop();
            }
            newSocket.emit('leave-room', roomId, user.username);
            newSocket.disconnect();
        };
    }, [roomId, roomName, navigate]);

    const handleStartMic = () => {
        if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Speech recognition not supproted in this browser');
            return;
        }
        if(!isRecording) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript && socket) {
                    // Send final transcription to all users in room
                    socket.emit('send-transcription', roomId, finalTranscript, username);
                }
            };
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError(`Error: ${event.error}`);
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
            setIsRecording(true);
            setError('');
        } else {
            // Stop recording
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsRecording(false);
        }
    };
    const handleLeaveRoom = () => {
        if (window.confirm('Are you sure you want to leave this room?')) {
            navigate('/app');
        }
    };

    return (
        <div>
            <div className="room-header">
                <h1>{roomName}</h1>
                <p>User: {username}</p>
                <button onClick={handleLeaveRoom}>Leave Room</button>
            </div>
            {error && (
                <div style={{
                    backgroundColor: '#fee',
                    color: '#c33',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}
            <div>
                {transcriptionText || 'Transcription will appear here...'}
            </div>
            <div className="button-options">
                {/*one for getting transcription from phone, getting from someone else, or sending a transcription to the room*/}
                <button onClick={handleStartMic}>
                    {isRecording ? 'Stop Recording' : 'Start Mic'}
                </button>
                <button>Send Transcription from Phone</button>
                <button>Get Transcription</button>
            </div>
        </div>
    )
}

export default TranscriptionRoom;