import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useTable, usePagination, useSortBy, useFilters } from "react-table";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navbar from "./Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [activeTreatmentCount, setActiveTreatmentCount] = useState(0);
  const [TreatmentSRate, setTreamentSRate] = useState(0);
  const [patientsData, setPatientsData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("patient");
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState(""); 
  const [conditionFilter, setConditionFilter] = useState(""); 
  const [ageFilter, setAgeFilter] = useState("");

  useEffect(() => {
    const userId = Cookies.get("authToken");
    if (!userId) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    console.log("Selected Table:", selectedTable);
    axios
      .get(`http://localhost:5000/get_table_data/${selectedTable}`)
      .then((response) => {
        setTableData(response.data);
        setFilteredData(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTableData([]); 
        setFilteredData([]); 
      });
  }, [selectedTable]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientResponse = await axios.get(
          "http://localhost:5000/getPatients"
        );
        const treatmentResponse = await axios.get(
          "http://localhost:5000/getTreatment"
        );

        setPatientsData(patientResponse.data);
        setTotalPatients(patientResponse.data.length);

        const totalTreatments = treatmentResponse.data.length;
        setActiveTreatmentCount(
          treatmentResponse.data.filter(
            (treatment) => treatment.Treatment_Status === "ongoing"
          ).length
        );

        const successfulTreatments = treatmentResponse.data.filter(
          (treatment) => treatment.Treatment_success === "Success"
        ).length;
        const successRate = (
          (successfulTreatments / totalTreatments) *
          100
        ).toFixed(2);

        setTreamentSRate(successRate);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(() => {
    if (selectedTable === "patient") {
      return [
        { Header: "Name", accessor: "Name" },
        { Header: "Age", accessor: "Age" },
        { Header: "Gender", accessor: "Gender" },
        { Header: "Blood Type", accessor: "Blood_Type" },
        { Header: "Medical Condition", accessor: "Medical_Condition" },
        { Header: "Doctor", accessor: "Doctor" },
        { Header: "Hospital", accessor: "Hospital" },
        { Header: "Medication", accessor: "Medication" },
        { Header: "Test Results", accessor: "Test_Results" },
      ];
    } else if (selectedTable === "Patient_treatment") {
      return [
        {
          Header: "Patient Name",
          accessor: (row) => {
            const patient = patientsData.find(
              (patient) => patient.Patient_id === row.Patient_id
            );
            return patient ? patient.Name : "Unknown";
          },
        },
        { Header: "Treatment Type", accessor: "Treatment_type" },
        { Header: "Treatment Method", accessor: "Treatment_method" },
        { Header: "Treatment Start Date", accessor: "Treatment_Start_Date" },
        { Header: "Treatment End Date", accessor: "Treatment_End_Date" },
        { Header: "Treatment Status", accessor: "Treatment_Status" },
      ];
    } else if (selectedTable === "outcome") {
      return [
        {
          Header: "Patient Name",
          accessor: (row) => {
            const patient = patientsData.find(
              (patient) => patient.Patient_id === row.Patient_id
            );
            return patient ? patient.Name : "Unknown";
          },
        },
        { Header: "Treatment Effectiveness ", accessor: "Effectiveness" },
        { Header: "Outcome Notes", accessor: "Outcome_Notes" },
      ];
    }
    return [];
  }, [selectedTable, patientsData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredData, 
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  

  const handleSearch = () => {
    let filtered = tableData;

    
    if (genderFilter) {
      filtered = filtered.filter((row) => row.Gender === genderFilter);
    }

    
    if (conditionFilter) {
      filtered = filtered.filter(
        (row) => row.Medical_Condition === conditionFilter
      );
    }

    
    if (ageFilter) {
      filtered = filtered.filter((row) => {
        const age = row.Age;
        if (ageFilter === "0-18") return age >= 0 && age <= 18;
        if (ageFilter === "19-40") return age >= 19 && age <= 40;
        if (ageFilter === "41-60") return age >= 41 && age <= 60;
        if (ageFilter === "60+") return age >= 60;
        return true;
      });
    }

    
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((row) =>
        Object.values(row).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredData(filtered); 
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        {/* <h1>Dashboard</h1> */}

        {/* Table Selection Dropdown */}
        <div className="table-selection">
          <label htmlFor="table-select">Select Table: </label>
          <select
            id="table-select"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="Patient_treatment">Patient Treatment</option>
            <option value="outcome">Outcome</option>
          </select>
        </div>

        {/* Overview Section */}
        <div className="overview-section">
          <h2>Overview</h2>
          <div className="overview-details">
            <p>Total Patients: {totalPatients}</p>
            <p>Active Treatments Count: {activeTreatmentCount}</p>
            <p>Treatment Success Rate: {TreatmentSRate}%</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div>
            <label htmlFor="gender-select">Gender: </label>
            <select
              id="gender-select"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="condition-select">Medical Condition: </label>
            <select
              id="condition-select"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Cancer">Cancer</option>
              <option value="Obesity">	Obesity</option>
              <option value="Arthritis">	Arthritis</option>
              <option value="Asthma">	Asthma</option>
              
            </select>
          </div>

          <div>
            <label htmlFor="age-select">Age: </label>
            <select
              id="age-select"
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="0-18">0-18</option>
              <option value="19-40">19-40</option>
              <option value="41-60">41-60</option>
              <option value="60+">60+</option>
            </select>
          </div>
        </div>

        

        {/* Data Table Section */}
        <div className="table-section">
          {/* <h2>{selectedTable}</h2> */}
          <table {...getTableProps()} className="patient-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows
                .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
                .map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {">>"}
            </button>
            <span>
              Page {pageIndex + 1} of {pageCount}
            </span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
