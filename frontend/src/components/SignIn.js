import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

function SignIn({ setIsLoggedIn, setIsAdmin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting signin with:', { email }); // Don't log password
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, {
                email,
                password
            });
            
            // Add detailed logging of the response
            console.log('Signin response:', {
                token: response.data.token ? 'exists' : 'missing',
                userId: response.data.userId,
                isAdmin: response.data.isAdmin,
                isAdminType: typeof response.data.isAdmin
            });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            
            // Make sure we're storing isAdmin as a string 'true' or 'false'
            localStorage.setItem('isAdmin', response.data.isAdmin === true ? 'true' : 'false');
            
            setIsLoggedIn(true);
            if (response.data.isAdmin) {
                setIsAdmin(true);
            }
            
            navigate('/');
        } catch (err) {
            console.error('Signin error:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Failed to sign in');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Sign In</h2>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Sign In</button>
                </form>
                <p>
                    Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
                </p>
            </div>
        </div>
    );
}

export default SignIn;