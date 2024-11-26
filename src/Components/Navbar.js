import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">OPTI - Clinical Analytics</h1>
      <ul className="navbar-links">
        <li><Link to="/welcome">Home</Link></li>
        <li><Link to="/dashboard">Patient Data</Link></li>
        <li><Link to="/charts">Charts</Link></li>
        <li><Link to="/prediction">Analytics</Link></li>
        <li><Link to="/patient">Patient Form</Link></li>
        <li><Link to="/login">Log out</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
