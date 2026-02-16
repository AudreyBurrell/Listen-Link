//css statement goes here
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleCreateAccount = () => {
        navigate('/create-account');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if(!username || !password) {
            setError('Make sure to fill out all fields');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if(response.ok) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                //navigate to main screen
                console.log('Login: success');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server error. Please try again');
            console.error('Login error:', err);
        }
    };

    return (
        <div>
            <div className="background-card">
                <h1>Login to ListenLink</h1>
                <div className="formArea">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="btnArea">
                    <button className="mainBtn" onClick={handleSubmit}>Login</button>
                    <button className="otherBtn" onClick={handleCreateAccount}>Create Account</button>
                </div>
            </div>
        </div>
    )
}

export default Login;