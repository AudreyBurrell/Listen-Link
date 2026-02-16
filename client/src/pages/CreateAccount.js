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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if(!username || !passwordOrig || !passwordRepeat) {
            setError('Make sure to fill out all fields');
            return;
        }
        if(passwordOrig != passwordRepeat) {
            setError('Original password and repeated password do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password: passwordOrig })
            });
            const data = await response.json();
            if(response.ok) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                //navigate to main screen
                console.log('Create account: success');
            } else {
                setError(data.message || 'Create account failed');
            }
        } catch (err) {
            setError('Server error. Please try again');
            console.error('Login error:', err);
        }
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
                    <button className="mainBtn" onClick={handleSubmit}>Create Account</button>
                    <button className="otherBtn" onClick={handleLogin}>Already Have an Account?</button>
                </div>
                
            </div>
        </div>
    )
}

export default CreateAccount;