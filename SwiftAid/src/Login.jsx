import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            setUser(userCredential.user);
            console.log('User logged in successfully');
            navigate("/dashboard");
        } catch (error) {
            setError(getFriendlyErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
            console.log('User logged in with Google successfully');
            navigate('/dashboard');
        } catch (error) {
            setError(getFriendlyErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    const getFriendlyErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email': return 'Invalid email format.';
            case 'auth/user-not-found': return 'No account found with this email.';
            case 'auth/wrong-password': return 'Incorrect password. Try again.';
            case 'auth/user-disabled': return 'This account has been disabled.';
            case 'auth/popup-closed-by-user': return 'Google sign-in was closed before completion.';
            default: return 'An error occurred. Please try again.';
        }
    };

    return (
        <div className="auth">
            <div className="auth-container">
                <h2>Login to <span className="brand">SwiftAid</span></h2>
                {error && <p className="error-message">{error}</p>}

                {user ? (
                    <p className="logged-in-message">You are already logged in.</p>
                ) : (
                    <>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                required 
                                onChange={handleChange} 
                                value={formData.email}
                            />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password" 
                                required 
                                onChange={handleChange} 
                                value={formData.password}
                            />
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="divider">
                            <hr /><span>or</span><hr />
                        </div>

                        <button onClick={handleGoogleLogin} className="google-btn" disabled={loading}>
                            <FcGoogle /> {loading ? 'Loading...' : 'Login with Google'}
                        </button>

                        <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </>
                )}
            </div>
        </div>
    );
}
