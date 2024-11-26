import React from 'react';
import Cookies from 'js-cookie';
import './WelcomePage.css'; 
import Navbar from './Navbar';
import welcomeImage from './Assests/welcome.jpeg'; 

const userName = Cookies.get('name');

const WelcomePage = ({ userName }) => {
  console.log("Name", userName);
  return (
    <div className="welcome-container">
      <Navbar />
      <div className="welcome-content">
        <h1>Welcome, {userName || 'User'}!</h1>
        <p>You have successfully logged in. Start exploring the dashboard.</p>
      </div>
    </div>
  );
};

export default WelcomePage;
