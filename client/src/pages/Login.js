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
                    <button className="mainBtn">Login</button>
                    <button className="otherBtn" onClick={handleCreateAccount}>Create Account</button>
                </div>
            </div>
        </div>
    )
}

export default Login;