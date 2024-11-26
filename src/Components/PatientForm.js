import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import './PatientForm.css';
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


const PatientForm = ({ patientId }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);



  
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    blood_type: "",
    medical_condition: "",
    doctor: "",
    hospital: "",
    medication: "",
    test_results: "",
  });


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patient.name || !patient.age || !patient.gender) {
      alert("Name, Age, and Gender are required!");
      return;
    }

    const url = patientId
      ? `http://localhost:5000/patients/${patientId}`  // Update URL if patientId is passed
      : "http://localhost:5000/patients";  // Add new patient if no patientId

    const method = patientId ? "put" : "post";  // Use PUT for update, POST for new patient

    try {
      await axios[method](url, patient);  // Make API request to save data
      alert(patientId ? "Patient updated successfully" : "Patient added successfully");
    } catch (err) {
      console.error("Error saving patient data:", err);
      alert("Error saving patient data");
    }
  };

  useEffect(() => {
    // Check for the userId in localStorage or cookies
    const userId = Cookies.get("authToken");
    if (!userId) {
      window.location.href = "/login";  // Using window.location.href for page redirect
    }
  }, []);

  useEffect(() => {
    // Fetch the user role from cookies or localStorage
    const userRole = Cookies.get("isadmin"); // Replace with localStorage.getItem() if needed
    setRole(userRole);

    if (userRole !== "1") {
      alert("You are not authorized to access this page!");
      navigate("/"); // Redirect to a different page if not admin
    }
  }, [navigate]);




  // Optionally, you can use useEffect to fetch patient data when editing an existing patient
  useEffect(() => {
    if (patientId) {
      const fetchPatientData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/patients/${patientId}`);
          setPatient(response.data);  // Set state with fetched data for editing
        } catch (err) {
          console.error("Error fetching patient data:", err);
        }
      };
      fetchPatientData();
    }
  }, [patientId]);

  return (
    <div>
      <Navbar/>
    <form onSubmit={handleSubmit}>
      <h2>Patient Information</h2>
      <input
        type="text"
        name="name"
        value={patient.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="number"
        name="age"
        value={patient.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />
      <select name="gender" value={patient.gender} onChange={handleChange}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <input
        type="text"
        name="blood_type"
        value={patient.blood_type}
        onChange={handleChange}
        placeholder="Blood Type"
      />
      <input
        type="text"
        name="medical_condition"
        value={patient.medical_condition}
        onChange={handleChange}
        placeholder="Medical Condition"
      />
      <input
        type="text"
        name="doctor"
        value={patient.doctor}
        onChange={handleChange}
        placeholder="Doctor"
      />
      <input
        type="text"
        name="hospital"
        value={patient.hospital}
        onChange={handleChange}
        placeholder="Hospital"
      />
      <input
        type="text"
        name="medication"
        value={patient.medication}
        onChange={handleChange}
        placeholder="Medication"
      />
      <textarea
        name="test_results"
        value={patient.test_results}
        onChange={handleChange}
        placeholder="Test Results"
      />

      <button type="submit">{patientId ? "Update Patient" : "Save Patient"}</button>
    </form>
  </div>
  );
};

export default PatientForm;
