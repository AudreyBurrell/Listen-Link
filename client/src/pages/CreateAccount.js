//css statement
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [passwordOrig, setPasswordOrig] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        navigate('/')
    }

    return (
        <div>
             <div className="background-card">
                <p>Create Account</p>
                <div className="formArea">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password1" name="password1" required value={passwordOrig} onChange={(e) => setPasswordOrig(e.target.value)} />
                    <label htmlFor="passwordRepeat">Repeat Password:</label>
                    <input type="password" id="password2" name="password2" required value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} />
                </div>
                <div className="btnArea">
                    <button className="mainBtn">Create Account</button>
                    <button className="otherBtn" onClick={handleLogin}>Already Have an Account?</button>
                </div>
                
            </div>
        </div>
    )
}

export default CreateAccount;