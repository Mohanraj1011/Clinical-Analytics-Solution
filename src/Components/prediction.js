import React, { useState } from 'react';
import axios from 'axios';
import './prediction.css';
import Navbar from './Navbar';

const App = () => {
  const [ageCategory, setAgeCategory] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleAgeCategoryChange = (e) => setAgeCategory(e.target.value);
  const handleMedicalConditionChange = (e) => setMedicalCondition(e.target.value);

  const fetchPrediction = async () => {
    try {
      console.log('Sending request:', { ageCategory, medicalCondition });

      const response = await axios.post('http://localhost:5000/api/predict', {
        ageCategory,
        medicalCondition,
      });

      setPrediction(response.data);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      alert('Error fetching prediction. Check if the backend is running.');
    }
  };

  return (
    <div className="container mt-5">
      <Navbar />
      <div className="text-center mb-4">
        <h3 className="mb-3 text-primary">Treatment Success Details</h3>
        {/* <p className="text-secondary">Select age category and medical condition to predict treatment outcomes.</p> */}
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="ageCategory" className="form-label">
              Age Category:
            </label>
            <select
              id="ageCategory"
              className="form-control"
              value={ageCategory}
              onChange={handleAgeCategoryChange}
            >
              <option value="">Select Age Category</option>
              <option value="1-20">1-20</option>
              <option value="21-30">21-30</option>
              <option value="31-40">31-40</option>
              <option value="41-50">41-50</option>
              <option value="51+">51+</option>
            </select>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="medicalCondition" className="form-label">
              Medical Condition:
            </label>
            <select
              id="medicalCondition"
              className="form-control"
              value={medicalCondition}
              onChange={handleMedicalConditionChange}
            >
              <option value="">Select Medical Condition</option>
              <option value="Cancer">Cancer</option>
              <option value="Obesity">Obesity</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Cardiac">Asthma</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="text-center">
            <button className="btn btn-primary w-100" onClick={fetchPrediction}>
              Results
            </button>
          </div>
        </div>
      </div>

      {prediction && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="card-title text-success">Details</h3>
                <h3 className="card-text">
                  <strong>Success Rate:</strong> {prediction.successRate}%
                </h3>
                <h3 className="card-text">
                  <strong>Average Treatment Duration:</strong> 14 days
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
