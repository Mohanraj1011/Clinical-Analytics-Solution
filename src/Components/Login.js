import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import Cookies from 'js-cookie';


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { username,role,name } = response.data;
        console.log("token is",username);
       // localStorage.setItem("token", username);
        Cookies.set('authToken', username, { expires: 1 }); // Expires in 1 day
        if(role=="1") {
          Cookies.set('isadmin',1, { expires: 1 });
        }else{
          Cookies.set('isadmin',0, { expires: 1 });
        }
        Cookies.set('name',name);
        window.location.href = "/welcome";
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to Clinical Analytics Solution</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
