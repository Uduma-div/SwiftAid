import React, { useState, useEffect } from 'react';
import {db, auth} from './firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Profile.css';


const ProfileComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, userInfo);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-content">
          <h2 className="profile-title">User Profile</h2>
          <div className="profile-fields">
            {['name', 'email', 'phone', 'address'].map((field) => (
              <div key={field} className="profile-field">
                <label className="profile-label">
                  {field}:
                </label>
                {isEditing ? (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={userInfo[field]}
                    onChange={handleChange}
                    className="profile-input"
                  />
                ) : (
                  <p className="profile-value">{userInfo[field]}</p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={isEditing ? handleSave : handleEditClick}
            className="profile-button"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;