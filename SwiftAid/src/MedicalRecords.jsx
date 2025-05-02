import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './MedicalRecord.css';

const MedicalRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({
    patientName: '',
    date: '',
    diagnosis: '',
    treatment: '',
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'medicalRecords'));
        const recordsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(recordsData);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    fetchRecords();

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add a medical record.');
      return;
    }

    const recordData = {
      ...newRecord,
      userId: user.uid,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'medicalRecords'), recordData);
      alert('Medical record added successfully!');
      setNewRecord({ patientName: '', date: '', diagnosis: '', treatment: '' });
      fetchRecords();
    } catch (error) {
      console.error('Error adding medical record:', error);
      alert('Failed to add medical record. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading medical records...</div>;
  }

  return (
    <div className="medical-record-container">
      <h2>Medical Records</h2>
      <form onSubmit={handleSubmit} className="medical-record-form">
        <div className="form-group">
          <label>Patient Name:</label>
          <input
            type="text"
            name="patientName"
            value={newRecord.patientName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={newRecord.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Diagnosis:</label>
          <textarea
            name="diagnosis"
            value={newRecord.diagnosis}
            onChange={handleChange}
            required
            className="form-input"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Treatment:</label>
          <textarea
            name="treatment"
            value={newRecord.treatment}
            onChange={handleChange}
            required
            className="form-input"
            rows="3"
          />
        </div>
        <button type="submit" className="submit-button">
          Add Medical Record
        </button>
      </form>

      <div className="record-list">
        <h3>Existing Records</h3>
        {records.length === 0 ? (
          <p>No medical records found.</p>
        ) : (
          <ul>
            {records.map(record => (
              <li key={record.id}>
                <h4>{record.patientName}</h4>
                <p>Date: {record.date}</p>
                <p>Diagnosis: {record.diagnosis}</p>
                <p>Treatment: {record.treatment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MedicalRecord;