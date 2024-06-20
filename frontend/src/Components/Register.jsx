// src/Register.js
import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css"

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/register/", { username, password, email })
      .then((response) => {
        console.log("Rejestracja udana:", response.data);
      })
      .catch((error) => {
        console.error("Błąd rejestracji:", error);
      });
  };

  return (
    <div className="register-container">
      <h1>Rejestracja</h1>
      <form onSubmit={handleRegister}>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" className="register-button">
          Zarejestruj się
        </button>
      </form>
    </div>
  );
};

export default Register;

