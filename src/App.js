// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';   
import Dashboard from './Components/dashboard';  
import PatientForm from './Components/PatientForm'; 
import Charts from './Components/charts'; 
import WelcomePage from './Components/Welcome';
import AnalyticsAndPredictions from './Components/prediction';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the login route */}
        <Route path="/login" element={<Login />} /> 
        
        {/* Define the dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Define the patient form route */}
        <Route path="/patient" element={<PatientForm />} />

        {/* Define the charts route */}
        <Route path="/charts" element={<Charts />} />

         {/* Define the welcome route */}
         <Route path="/welcome" element={<WelcomePage />} />

         {/* Define the prediction route */}
         <Route path="/prediction" element={<AnalyticsAndPredictions />} />

        {/* Default route */}
        <Route path="/" element={<Login />} /> {/* Redirect to login page if no route matches */}
      </Routes>
    </Router>
  );
}

export default App;
