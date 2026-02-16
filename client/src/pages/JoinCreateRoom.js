//css statement goes here
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinCreateRoom() {
    const navigate = useNavigate();
    const [createRoom, showCreateRoomPopup] = useState(false);
    const [roomName, createRoomName] = useState('');
    const [roomList, setRoomList] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            return;
        }
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/rooms/list', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if(response.ok) {
                setRoomList(data.rooms);
                console.log(data.rooms);
            } else {
                setError(data.message || 'Failed to load rooms');
            }
        } catch (err) {
            setError('Server error. Please try again');
            console.error('Fetching rooms error:', err);
        }
    };

    const handleCreateRoomPopup = () => {
        showCreateRoomPopup(true);
    }

    const handleCloseRoomPopup = async () => {
        //checking if the room name is empty --> show false and return
        if(roomName.trim() === '') {
            showCreateRoomPopup(false);
            createRoomName('');
            setError('');
            return;
        } else {
            const token = sessionStorage.getItem('token');
            setError('');
            try {
                const response = await fetch('http://localhost:5000/api/rooms/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ roomName })
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Room created!', data);
                    showCreateRoomPopup(false);
                    createRoomName('');
                    fetchRooms();
                } else {
                    setError(data.message || 'Failed to create room');
                }
            } catch (err) {
                setError('Server error. Please try again');
                console.error('Fetching rooms error:', err);
            }
        }
    }

    const handleJoinRoom = async (roomId) => {
        const token = sessionStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:5000/api/rooms/join/${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Joined room:', data);
                navigate(`/room/${roomId}`);
            } else {
                alert(data.message || 'Failed to join room');
            }
        } catch (err) {
            alert('Server error. Please try again.');
            console.error('Error joining room:', err);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this room?')) {
            return;
        }

        const token = sessionStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:5000/api/rooms/delete/${roomId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Room deleted:', data);
                fetchRooms();
            } else {
                alert(data.message || 'Failed to delete room');
            }
        } catch (err) {
            alert('Server error. Please try again.');
            console.error('Error deleting room:', err);
        }
    };

    return (
        <div>
            <h1>Join or Create a Room</h1>
            <div className="roomList">
                {roomList.length === 0 ? (
                    <p>No active rooms. Create one to get started!</p>
                ) : (
                    <div>
                        {roomList.map((room) => (
                            <div key={room.id} style = {{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '1rem',
                                backgroundColor: 'white'
                            }}>
                                <h3>{room.name}</h3>
                                <p>Created by: {room.createdBy}</p>
                                <p>Participants: {room.participantCount}</p>
                                <p>Created: {new Date(room.createdAt).toLocaleString()}</p>
                                <div style={{marginTop: '0.5rem'}}>
                                    <button
                                        onClick={() => handleJoinRoom(room.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '0.5rem'
                                        }}
                                    >
                                        Join Room
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete Room
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button className="createRoom" onClick={handleCreateRoomPopup}>+ Room</button>
            {createRoom && (
                <div className="popup-background" onClick={handleCloseRoomPopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Create Room</h2>
                        <label>
                            Enter a name:
                            <input type="text" value={roomName} rows={4} placeholder="Enter name..." onChange={(e) => createRoomName(e.target.value)} />
                        </label>
                        <button onClick={handleCloseRoomPopup}>Submit</button>
                    </div>  
                </div>
            )}
        </div>
    )
}

export default JoinCreateRoom;

/*

For each room that is currently in session (separated by rectangle dividers) there is join to be a join room button and a 
delete room button (delete will have a "are you sure" popup).

A button at the bottom to create rooms

*/