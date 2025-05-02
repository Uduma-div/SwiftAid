import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import doctorsData from './doctors.json'; 
import './Appointment.css';

const AppointmentBookingComponent = () => {
  const [appointment, setAppointment] = useState({
    doctorName: '',
    date: '',
    time: '',
    reason: '',
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [doctors, setDoctors] = useState(doctorsData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

   
    setDoctors(doctorsData);

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to book an appointment.');
      return;
    }
  
    const appointmentData = {
      ...appointment,
      userId: user.uid,
      createdAt: new Date(),
    };
  
    console.log("Submitting appointment data:", appointmentData);
  
    try {
      const docRef = await addDoc(collection(db, "appointments"), appointmentData);
      alert('Appointment booked successfully!');
      setAppointment({ doctorName: '', date: '', time: '', reason: '' });
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="appointment-loading">Loading...</div>;
  }

  return (
    <div className="appointment-container">
      <div className="appointment-card">
        <h2 className="appointment-title">Book an Appointment</h2>
        <form onSubmit={handleSubmit} className="appointment-form">
          
          {/* Search Input for Doctors */}
          <div className="form-group">
            <label className="form-label">Search Doctor:</label>
            <input
              type="text"
              placeholder="Search doctor by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-input"
            />
          </div>

          {/* Select Doctor Dropdown */}
          <div className="form-group">
            <label className="form-label">Doctor's Name:</label>
            <select
              name="doctorName"
              value={appointment.doctorName}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select a doctor</option>
              {filteredDoctors.map(doctor => (
                <option key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date:</label>
            <input
              type="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time:</label>
            <input
              type="time"
              name="time"
              value={appointment.time}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Appointment:</label>
            <textarea
              name="reason"
              value={appointment.reason}
              onChange={handleChange}
              required
              className="form-input form-textarea"
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBookingComponent;