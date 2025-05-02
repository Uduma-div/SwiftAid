import React, { useState, useEffect } from 'react';
import doctorsData from './doctors.json'; 
import './doctor.css';

const DoctorListing = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    setDoctors(doctorsData);
  }, []);

  return (
    <div className="doctor-container">
      <h2>Our Doctors</h2>
      <div className="doctor-card">
        {doctors.map(doctor => (
          <div key={doctor.name} className="doctor-card">
            <img src={doctor.imageUrl} alt={doctor.name} className="doctor-image" />
            <h3>{doctor.name}</h3>
            <p className="speciality">{doctor.specialty}</p>
            <p className='experience'>{doctor.experience} years experience</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorListing;