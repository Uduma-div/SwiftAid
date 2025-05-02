import React, { useState, useEffect } from 'react';
import { MapPin, Ambulance, FileText, AlertTriangle } from 'lucide-react';
import './Eambulance.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';



const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject('Geolocation not supported');
    }
  });
};

export default function Eambulance() {
  const [location, setLocation] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [ambulanceType, setAmbulanceType] = useState('');
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    condition: [],
    medicalHistory: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocation()
      .then((loc) => setLocation(`${loc.latitude}, ${loc.longitude}`))
      .catch((err) => console.log(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleConditionChange = (e) => {
    const { value, checked } = e.target;
    setPatientDetails(prevState => ({
      ...prevState,
      condition: checked
        ? [...prevState.condition, value]
        : prevState.condition.filter(condition => condition !== value)
    }));
  };

  const handleFileChange = (e) => {
    setPatientDetails({ ...patientDetails, medicalHistory: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let medicalHistoryUrl = null;
      if (patientDetails.medicalHistory) {
        const storageRef = ref(`storage, medical_history/${patientDetails.medicalHistory.name}`);
        await uploadBytes(storageRef, patientDetails.medicalHistory);
        medicalHistoryUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, "emergencyOrders"), {
        location: useCurrentLocation ? location : manualLocation,
        ambulanceType,
        patientDetails: {
          ...patientDetails,
          medicalHistory: medicalHistoryUrl,
        },
        timestamp: new Date(),
      });

      alert(`Emergency Ambulance Booked. Order ID:${docRef.id}`);
    } catch (error) {
      console.error("Error submitting order: ", error);
      setError("An error occurred while submitting your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="eambulance-container">
      <h2><AlertTriangle size={24} /> Emergency Ambulance Order</h2>

      <div className="location-section">
        <h3><MapPin size={20} /> Location</h3>
        <div className="location-toggle">
          <label>
            <input
              type="checkbox"
              checked={useCurrentLocation}
              onChange={() => setUseCurrentLocation(!useCurrentLocation)}
            />
            Use current location
          </label>
        </div>
        {useCurrentLocation ? (
          <div className="current-location">
            <p>{location ? location : 'Fetching location...'}</p>
          </div>
        ) : (
          <input
            type="text"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            placeholder="Enter your location manually"
          />
        )}
      </div>

      <div className="ambulance-section">
        <h3><Ambulance size={20} /> Select Ambulance</h3>
        <div className="ambulance-options">
          {['Basic', 'Advanced Life Support', 'Air Ambulance'].map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="ambulanceType"
                value={type.toLowerCase()}
                checked={ambulanceType === type.toLowerCase()}
                onChange={(e) => setAmbulanceType(e.target.value)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        <h3><FileText size={20} /> Patient Details</h3>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" name="age" onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Medical Condition</label>
          <div className="condition-options">
            {['Cardiac Arrest', 'Accident', 'Breathing Difficulty'].map((condition) => (
              <label key={condition}>
                <input
                  type="checkbox"
                  name="condition"
                  value={condition}
                  onChange={handleConditionChange}
                />
                {condition}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="medicalHistory">Medical History</label>
          <input type="file" id="medicalHistory" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn btn-emergency" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Book Emergency Ambulance'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}