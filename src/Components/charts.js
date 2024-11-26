import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import Navbar from './Navbar';
import "./charts.css";

const Dashboard = () => {
  const [treatmentStatusData, setTreatmentStatusData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [conditionData, setConditionData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('patient'); 

  useEffect(() => {
    // Fetch treatment status data
    axios.get('http://localhost:5000/api/treatment-status')
      .then(response => setTreatmentStatusData(response.data))
      .catch(error => console.error('Error fetching treatment status data', error));

    // Fetch gender demographics data
    axios.get('http://localhost:5000/api/patient-demographics-gender')
      .then(response => setGenderData(response.data))
      .catch(error => console.error('Error fetching gender data', error));

    // Fetch age demographics data
    axios.get('http://localhost:5000/api/patient-demographics-age')
      .then(response => setAgeData(response.data))
      .catch(error => console.error('Error fetching age data', error));

    // Fetch medical condition demographics data
    axios.get('http://localhost:5000/api/patient-demographics-medical-condition')
      .then(response => setConditionData(response.data))
      .catch(error => console.error('Error fetching condition data', error));

    // Fetch line chart data
    axios.get('http://localhost:5000/api/treatment-line-chart-data')
      .then(response => setLineChartData(response.data))
      .catch(error => console.error('Error fetching line chart data', error));
  }, []);

  // Treatment Status Pie Chart
  const treatmentStatusChart = (
    <Pie
      data={{
        labels: treatmentStatusData.map(item => item.Treatment_Status),
        datasets: [
          {
            data: treatmentStatusData.map(item => item.count),
            backgroundColor: ['#33FF57', '#FF5733'],
          },
        ],
      }}
    />
  );

  // Demographics Gender Pie Chart
  const demographicsGenderChart = (
    <Pie
      data={{
        labels: genderData.map(item => item.Gender),
        datasets: [
          {
            data: genderData.map(item => item.count),
            backgroundColor: ['#33FF57', '#f39c12'],
          },
        ],
      }}
    />
  );

  // Age Group Bar Chart
const ageChart = (
  <Line
    data={{
      labels: ageData.map(item => item.AgeGroup), // Labels for each age group
      datasets: [
        {
          label: 'Success',
          data: ageData
            .filter(item => item.Treatment_Success === 'Success')
            .map(item => item.Count),
          backgroundColor: '#4CAF50', // Green for success
          borderColor: '#388E3C',
          borderWidth: 1,
        },
        {
          label: 'Failure',
          data: ageData
            .filter(item => item.Treatment_Success === 'Failure')
            .map(item => item.Count),
          backgroundColor: '#F44336', // Red for failure
          borderColor: '#D32F2F',
          borderWidth: 1,
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true },
      },
      scales: {
        x: { title: { display: true, text: 'Age Group' } },
        y: { title: { display: true, text: 'Count' }, beginAtZero: true },
      },
    }}
  />
);

  // Medical Condition Pie Chart
  const conditionChart = (
    <Bar
      data={{
        labels: conditionData.map(item => item.Medical_Condition),
        datasets: [
          {
            data: conditionData.map(item => item.count),
            backgroundColor: ['#8BC34A', '#FFC107', '#E91E63', '#03A9F4', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#4CAF50'],
          },
        ],
      }}
    />
  );

// Monthly success and failure line chart
const lineChart = (() => {
  
  const successData = lineChartData.filter(item => item.Treatment_success === 'Success');
  const failureData = lineChartData.filter(item => item.Treatment_success === 'Failure');
  const months = [...new Set(lineChartData.map(item => item.month))];

  const successCounts = months.map(month => successData.find(data => data.month === month)?.count || 0);
  const failureCounts = months.map(month => failureData.find(data => data.month === month)?.count || 0);

  return (
    <div className="chart-left">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Monthly Success vs Failure
      </h2>
      <Line
        data={{
          labels: months,
          datasets: [
            {
              label: 'Success',
              data: successCounts,
              borderColor: '#4CAF50', // Green border for success
              backgroundColor: 'rgba(76, 175, 80, 0.2)', 
              tension: 0.4, 
              pointRadius: 4, 
              pointBackgroundColor: '#4CAF50', 
              pointHoverRadius: 6,
            },
            {
              label: 'Failure',
              data: failureCounts,
              borderColor: '#F44336', // Red border for failure
              backgroundColor: 'rgba(244, 67, 54, 0.2)', 
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#F44336',
              pointHoverRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#555', 
                font: {
                  size: 14,
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
                color: '#333',
                font: {
                  size: 16,
                  weight: 'bold',
                },
              },
              ticks: {
                color: '#555',
                font: {
                  size: 12,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Count',
                color: '#333',
                font: {
                  size: 16,
                  weight: 'bold',
                },
              },
              ticks: {
                beginAtZero: true,
                color: '#555',
                font: {
                  size: 12,
                },
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.3)', 
              },
            },
          },
        }}
      />
    </div>
  );
})();

  

  // Handle the dropdown change
  const handleChartSelection = (event) => {
    setSelectedChart(event.target.value);
  };

  // Render the correct chart based on the selected value
  const renderChart = () => {
    switch (selectedChart) {
      case 'patient':
        return (
          <div className="chart-container">
            <div className="chart-left">
              {treatmentStatusChart} {/* Display Treatment Status Pie chart */}
            </div>
            <div className="chart-right">
              {demographicsGenderChart} {/* Display Gender Pie chart */}
            </div>
          </div>
        );
      case 'Patient_treatment':
        return (
          <div className="chart-container">
            <div className="chart-left">
              {ageChart} {/* Display Age Group Bar chart */}
            </div>
            <div className="chart-right">
              {conditionChart} {/* Display Medical Condition Pie chart */}
            </div>
          </div>
        );
      case 'lineChart':
        return lineChart; // Display the line chart
      default:
        return <div>Select a valid chart</div>;
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Charts</h1>
      <div style={{ paddingBottom: '50px' }}>
      <div className="table-selection">
        <label htmlFor="table-select">Select Chart: </label>
        <select onChange={handleChartSelection} value={selectedChart}>
          <option value="patient">Treatment Status and Gender</option>
          <option value="Patient_treatment">Age Group and Medical Condition</option>
          <option value="lineChart">Monthly Success and Failure</option>
        </select>
      </div>
      </div>
      <div style={{ width: '80%', height: '400px', margin: '0 auto' }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default Dashboard;
