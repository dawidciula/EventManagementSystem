// src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; // Import the CSS file for styles

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/login/", { username, password })
      .then((response) => {
        console.log("Logowanie udane:", response.data);
      })
      .catch((error) => {
        console.error("Błąd logowania:", error);
      });
  };

  return (
    <div className="login-container">
      <h1>Logowanie</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Nazwa użytkownika:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Zaloguj się
        </button>
      </form>
    </div>
  );
};

export default Login;
