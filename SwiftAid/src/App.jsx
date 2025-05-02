import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppointmentBookingComponent from "./Appointment";
import Eambulance from "./Eambulance";
import LandingPage from "./LandingPage";
import Login from "./Login";
import ProfileComponent from "./Profile";
import Signup from "./Signup";
import NavBar from "./Navbar";
import UserDashboard from "./UserDashboard";
import DoctorListing from './Doctors';
import MedicalRecords from './MedicalRecords';
import AppointmentsList from './AppointmentList';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/emergency" element={<Eambulance />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileComponent />} />
        <Route path="/doctors" element={<DoctorListing />}/>
        <Route path="/records" element={<MedicalRecords />}/>
        <Route path="/appointment" element={<AppointmentsList />} />
        <Route path="/bookappointment" element={<AppointmentBookingComponent />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
}