const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(express.json()); 

app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true, 
 }));


app.use(
    session({
      secret: "this-my-secret", 
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, 
        secure: false, 
        maxAge: 1000 * 60 * 60, 
      },
    })
  );
  app.post("/logout", (req, res) => {
    req.session.destroy(() => {
      res.status(200).send({ message: "Logged out" });
    });
  });

// MySQL Database connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "720075mM@", 
  database: "clinical_analytics" 
});


db.connect((err) => {
  if (err) {
    console.error("Could not connect to database:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});


// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const checkQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkQuery, [username], (err, results) => {
    if (err) return res.status(500).send({ message: "Database error" });
    console.log("Results:", results); 
    if (results.length == 0) {
        console.log("Len",results.length);
    }
    if (results.length =! 0) {
        console.log("Len",results.length);
        console.log("USer if found")
    }
    if (results.length == 0) 
    {
        return res.status(401).send({ message: "Invalid credentials" });
    }
    const user = results[0];

    if (password !== user.password) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      req.session.userId = user.id; 
     res.status(200).send({ message: "Login successful", username: user.username ,role:user.isadmin,name:user.name });

    
  });
});

// Get patientd details from db
app.get("/getPatients",(req,res) => {
  const query = "SELECT * FROM patient";
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send({ message: "Database error" });
      }
      res.json(results);
    });
  });

// Get patientd treatment details from db
  app.get("/getTreatment",(req,res) => {
    const query = "SELECT * FROM Patient_treatment";
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).send({ message: "Database error" });
        }
        res.json(results);
      });
    });


app.get("/dashboard/overview", (req, res) => {
    const overviewData = {
      totalPatients: 100, 
      activeTreatments: 50, 
      treatmentSuccessRate: 85, 
    };
    res.json(overviewData);
  });
  
  
  app.get("/dashboard/patients", (req, res) => {
    // Fetch patient records from the database
    const query = "SELECT * FROM patient";
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send({ message: "Database error" });
      }
      res.json(results);
    });
  });

  // fetch key performance metrics (KPIs)
app.get('/api/kpis', (req, res) => {
  const query = `
    SELECT COUNT(DISTINCT Patient_id) AS TotalPatients, 
           COUNT(DISTINCT CASE WHEN Treatment_Status = 'Ongoing' THEN Treatment_id END) AS ActiveTreatments,
           COUNT(DISTINCT CASE WHEN Treatment_Status = 'Completed' THEN Treatment_id END) AS CompletedTreatments,
           AVG(DATEDIFF(Treatment_End_Date, Treatment_Start_Date)) AS AvgTreatmentDuration
    FROM Patient_treatment
    JOIN Patient ON Patient_treatment.Patient_id = Patient.Patient_id;
  `;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

// fetch treatment status 
app.get('/api/treatment-status', (req, res) => {
  const query = `
    SELECT Treatment_Status, COUNT(*) AS count
    FROM Patient_treatment
    GROUP BY Treatment_Status;
  `;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// fetch patient demographics (gender distribution)
app.get('/api/patient-demographics-gender', (req, res) => {
  const query = `
    SELECT Gender, COUNT(*) AS count
    FROM Patient
    GROUP BY Gender;
  `;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


// fetch age group demographics
app.get('/api/patient-demographics-age', (req, res) => {
  const ageQuery = `
    SELECT 
      CASE
        WHEN p.Age BETWEEN 0 AND 18 THEN '0-18'
        WHEN p.Age BETWEEN 19 AND 35 THEN '19-35'
        WHEN p.Age BETWEEN 36 AND 50 THEN '36-50'
        WHEN p.Age BETWEEN 51 AND 65 THEN '51-65'
        ELSE '65+'
      END AS AgeGroup,
      t.Treatment_Success,
      COUNT(*) AS Count
    FROM 
      Patient p
    JOIN 
      Patient_Treatment t ON p.Patient_ID = t.Patient_ID
    GROUP BY 
      AgeGroup, t.Treatment_Success
    ORDER BY 
      AgeGroup;
  `;

  db.query(ageQuery, (err, result) => {
    if (err) {
      console.error('Error fetching age demographics:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(result);
  });
});

// fetch count of medical condition
app.get('/api/patient-demographics-medical-condition', (req, res) => {
  const conditionQuery = `
    SELECT Medical_Condition, COUNT(*) AS count
    FROM Patient
    GROUP BY Medical_Condition;
  `;

  db.query(conditionQuery, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// fetch line chart data for treatments over time
app.get('/api/treatment-line-chart-data', (req, res) => {
  const query = `
      SELECT 
  DATE_FORMAT(Treatment_Start_Date, '%Y-%m') AS month,
  Treatment_success, 
  COUNT(*) AS count
FROM Patient_treatment
WHERE Treatment_Start_Date IS NOT NULL
GROUP BY month, Treatment_success
ORDER BY month, Treatment_success;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching line chart data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});


app.get('/api/treatment-effectiveness', (req, res) => {
  const query = `
    SELECT Patient.Age, Outcome.Effectiveness
    FROM Outcome
    JOIN Patient ON Outcome.Patient_id = Patient.Patient_id;
  `;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

//fetch treatment types distribution
app.get('/api/treatment-types', (req, res) => {
  const query = `
    SELECT Treatment_type, COUNT(*) AS count
    FROM Patient_treatment
    GROUP BY Treatment_type;
  `;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Add new patient
app.post("/patients", (req, res) => {
    const { name, age, gender, blood_type, medical_condition, doctor, hospital, medication, test_results } = req.body;
  
    if (!name || !age || !gender) {
      return res.status(400).json({ message: "Name, Age, and Gender are required" });
    }
  
    const query = "INSERT INTO Patient (Name, Age, Gender, Blood_Type, Medical_Condition, Doctor, Hospital, Medication, Test_Results) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [name, age, gender, blood_type, medical_condition, doctor, hospital, medication, test_results], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send({ message: "Error saving patient record" });
      }
      res.status(201).send({ message: "Patient added successfully" });
    });
  });

  
  // Dashboard Selection table

  const validTables = ["patient", "Patient_treatment", "outcome"]; 
  app.get("/get_table_data/:tableName", async (req, res) => {
    const { tableName } = req.params;
  
    console.log("Query one table name", tableName);
    // Validate table name
    if (!validTables.includes(tableName)) {
      return res.status(400).json({ error: "Invalid table name" });
    }
    
    try {
      
      const query = `SELECT * FROM ??`;
      db.query(query, [tableName], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error fetching data" });
        }
        res.status(200).json(results);
        console.log("result size",results.length);
      });
    } catch (error) {
      console.error("Error querying the database:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Edit existing patient
  app.put("/patients/:id", (req, res) => {
    const { id } = req.params;
    const { name, age, gender, blood_type, medical_condition, doctor, hospital, medication, test_results } = req.body;
  
    const query = "UPDATE Patient SET Name = ?, Age = ?, Gender = ?, Blood_Type = ?, Medical_Condition = ?, Doctor = ?, Hospital = ?, Medication = ?, Test_Results = ? WHERE Patient_id = ?";
    db.query(query, [name, age, gender, blood_type, medical_condition, doctor, hospital, medication, test_results, id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send({ message: "Error updating patient record" });
      }
      res.status(200).send({ message: "Patient updated successfully" });
    });
  });
  
  // Delete patient
  app.delete("/patients/:id", (req, res) => {
    const { id } = req.params;
  
    const query = "DELETE FROM Patient WHERE Patient_id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send({ message: "Error deleting patient record" });
      }
      res.status(200).send({ message: "Patient deleted successfully" });
    });
  });
  
  // Get patient history (treatment and outcome)
  app.get("/patients/:id/history", (req, res) => {
    const { id } = req.params;
  
    const query = `
      SELECT pt.Treatment_type, pt.Treatment_method, pt.Treatment_Start_Date, pt.Treatment_End_Date, pt.Treatment_Status, 
             o.Effectiveness, o.Outcome_Notes
      FROM Patient_treatment pt
      LEFT JOIN Outcome o ON pt.Treatment_id = o.Treatment_id
      WHERE pt.Patient_id = ?;
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send({ message: "Error fetching patient history" });
      }
      res.status(200).json(results);
    });
  });

// analytics
  app.post('/api/predict', (req, res) => {
    const { ageCategory, medicalCondition } = req.body;
  
    
    const ageRanges = {
      '1-20': [1, 20],
      '21-30': [21, 30],
      '31-40': [31, 40],
      '41-50': [41, 50],
      '51+': [51, 100],
    };
  
    
    const [minAge, maxAge] = ageRanges[ageCategory];
  
    
    const query = `
      SELECT 
        COUNT(DISTINCT pt.Patient_id) AS TotalPatients,
        COUNT(DISTINCT CASE WHEN pt.Treatment_Status = 'Ongoing' THEN pt.Treatment_id END) AS ActiveTreatments,
        COUNT(DISTINCT CASE WHEN pt.Treatment_Status = 'Completed' THEN pt.Treatment_id END) AS CompletedTreatments,
        AVG(DATEDIFF(pt.Treatment_End_Date, pt.Treatment_Start_Date)) AS AvgTreatmentDuration
      FROM Patient_treatment pt
      JOIN Patient p ON pt.Patient_id = p.Patient_id
      WHERE p.Medical_Condition = ? AND p.Age BETWEEN ? AND ?;
    `;
  
    db.query(query, [medicalCondition, minAge, maxAge], (err, results) => {
      if (err) {
        console.error('Error fetching data from the database:', err);
        return res.status(500).send('Database query failed');
      }
  
      
      if (results.length === 0) {
        return res.json({
          successRate: 0,
          treatmentDuration: 0,
        });
      }
  
      
      const result = results[0];
  
      
      const successRate = result.CompletedTreatments > 0
        ? (result.CompletedTreatments / result.TotalPatients) * 100
        : 0;
  
      
      const avgDuration = (typeof result.AvgTreatmentDuration === 'number' && !isNaN(result.AvgTreatmentDuration))
        ? result.AvgTreatmentDuration.toFixed(2)
        : 0;
  
      
      res.json({
        successRate: successRate.toFixed(2),
        treatmentDuration: avgDuration, 
      });
    });
  });
  
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
