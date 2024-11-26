// import React, { useState } from "react";
// import axios from "axios";
// import "./Loginsignup.css"; // CSS for Login/Signup

// const LoginSignup = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user"); // Default role is user
//   const [isSignup, setIsSignup] = useState(true); // Set true to show signup page initially

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     // URL changes depending on whether it's signup or login
//     const url = isSignup ? "http://localhost:5000/signup" : "http://localhost:5000/login";
    
//     try {
//       const response = await axios.post(url, { username, password, role });
  
//       if (isSignup) {
//         alert("Signup successful! You can now log in.");
//         setIsSignup(false); // Switch to login form after successful signup
//       } else {
//         alert(response.data.message);
//         localStorage.setItem("token", response.data.token); // Store token after login
//       }
//     } catch (error) {
//       // Log the error for debugging purposes
//       console.error("Error during signup:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "Something went wrong.");
//     }
//   };
  

//   return (
//     <div className="login-signup-container">
//       <form onSubmit={handleSubmit}>
//         <h2>{isSignup ? "Signup" : "Login"}</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         {isSignup && (
//           <div>
//             <label>
//               <input
//                 type="radio"
//                 value="user"
//                 checked={role === "user"}
//                 onChange={() => setRole("user")}
//               />
//               User
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 value="admin"
//                 checked={role === "admin"}
//                 onChange={() => setRole("admin")}
//               />
//               Admin
//             </label>
//           </div>
//         )}
//         <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
//         <p>
//           {isSignup
//             ? "Already have an account? Log in here."
//             : "Don't have an account? Sign up here."}
//         </p>
//         <button type="button" onClick={() => setIsSignup(!isSignup)}>
//           {isSignup ? "Log In" : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginSignup;
