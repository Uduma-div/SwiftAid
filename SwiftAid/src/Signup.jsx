import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate= useNavigate();
    const goToLogin = () =>{
        navigate("/login");
    }
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        dateOfBirth: '',
        emergencyName: '',
        emergencyPhone: '',
        agreeTerms: false
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formData.dateOfBirth,
                emergencyName: formData.emergencyName,
                emergencyPhone: formData.emergencyPhone
            });

            console.log('User registered successfully');
            navigate("/dashboard")
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            await setDoc(doc(db, 'users', user.uid), {
                fullName: user.displayName,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                password: user.password,
            });

            console.log('User signed up with Google successfully');
            navigate("/dashboard")
        } catch (error) {
            setError(error.message);
        }
      
    };

    return (
        <div className="auth">
        <div className="auth-container">
            <h2>Sign Up for <span className="brand">SwiftAid</span></h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="fullName" 
                    placeholder="Full Name" 
                    required 
                    onChange={handleChange} 
                    value={formData.fullName}
                />
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
                <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Confirm Password" 
                    required 
                    onChange={handleChange} 
                    value={formData.confirmPassword}
                />
                <input 
                    type="tel" 
                    name="phoneNumber" 
                    placeholder="Phone Number" 
                    required 
                    onChange={handleChange} 
                    value={formData.phoneNumber}
                />
                <input 
                    type="date" 
                    name="dateOfBirth" 
                    placeholder="Date of Birth" 
                    required 
                    onChange={handleChange} 
                    value={formData.dateOfBirth}
                />
                <input 
                    type="text" 
                    name="emergencyName" 
                    placeholder="Emergency Contact Name" 
                    required 
                    onChange={handleChange} 
                    value={formData.emergencyName}
                />
                <input 
                    type="tel" 
                    name="emergencyPhone" 
                    placeholder="Emergency Contact Phone" 
                    required 
                    onChange={handleChange} 
                    value={formData.emergencyPhone}
                />
                <div className="terms">
                    <input 
                        type="checkbox" 
                        name="agreeTerms" 
                        id="terms" 
                        required 
                        onChange={handleChange} 
                        checked={formData.agreeTerms}
                    />
                    <label htmlFor="terms">I agree to the Terms and Conditions and Privacy Policy</label>
                </div>
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
            <div className="divider">
                <hr /><span>or</span><hr />
            </div>
            <button onClick={handleGoogleSignup} className="google-btn">
                <FcGoogle /> Sign up with Google
            </button>
            <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
        </div>
    );
}