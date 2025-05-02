import React from 'react';
import CountUp from 'react-countup';
import { ArrowRight, Phone, Clock, Users, Briefcase } from 'lucide-react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const navigate = useNavigate();
  const goToEmergency = ()=>{
     navigate("/emergency");
  }

  const goToSignup = () =>{
    navigate("/signup");
  }
  return (
    <div className="landing-page">
      <main>
        <section id="home" className="hero">
          <div className="container">
            <div className=
            "hero-content">
              <h1>Connecting You to Lifesaving Medical Services</h1>
              <p>
                At <span className="highlight">SwiftAid</span>, we provide essential healthcare services, including emergency ambulance assistance, access to medical records, and real-time support.
              </p>
              <div className="cta-buttons">
                <button className="btn btn-emergency" onClick={goToEmergency}>Emergency Ambulance</button>
                <button className="btn btn-primary" onClick={goToSignup}>Get Started <ArrowRight size={16} /></button>
              </div>
            </div>
            <div className="hero-image">
              <img src="./amb.jpg" alt="Emergency Services" />
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="container">
            <h2>Why Choose <span className="highlight">SwiftAid</span></h2>
            <div className="feature-grid">
              <div className="feature-item">
                <Phone size={32} />
                <h3>Fast Ambulance Booking</h3>
                <p>Book an ambulance with just a few taps on your smartphone.</p>
              </div>
              <div className="feature-item">
                <Clock size={32} />
                <h3>24/7 Support</h3>
                <p>Our team is available round the clock to assist you.</p>
              </div>
              <div className="feature-item">
                <Users size={32} />
                <h3>Access Medical Records</h3>
                <p>Easily access and share your medical history when needed.</p>
              </div>
              <div className="feature-item">
                <Briefcase size={32} />
                <h3>Qualified Professionals</h3>
                <p>Our network consists of highly trained medical professionals.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="stats">
          <div className="container">
            <h2>SwiftAid by the Numbers</h2>
            <div className="stats-grid">
              <div className="stats-item">
                <h3>Lives Saved</h3>
                <CountUp end={1000} duration={5} separator="," />
              </div>
              <div className="stats-item">
                <h3>Active Users</h3>
                <CountUp end={50000} duration={5} separator="," />
              </div>
              <div className="stats-item">
                <h3>Avg. Response Time</h3>
                <CountUp end={8} duration={5} suffix=" min" />
              </div>
              <div className="stats-item">
                <h3>Ambulance Partners</h3>
                <CountUp end={500} duration={5} separator="," />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container">
            <h2>About Us</h2>
            <p>
              In medical emergencies, every second counts. That's why we developed <span className="highlight">SwiftAid</span>, an ambulance booking app designed to streamline services, ensuring faster response times and improving public health and safety.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2024 SwiftAid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;