import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve CSRF token from cookies
  const csrfToken = Cookies.get("csrftoken");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send login request with CSRF token in headers
      await axios.post(
        "http://localhost:8000/api/login/",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken, // Add CSRF token to headers
          },
          withCredentials: true, // Make sure cookies are sent with request
        }
      );

      // Redirect to home or dashboard page on successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      console.log("Sending login data:", { username, email, password });
      console.log("CSRF Token:", csrfToken);
      setError("Invalid username, email, or password.");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
