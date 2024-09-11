// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSearch } from "../components/SearchContext"; // Import useSearch
import "../styles/Navbar.css";
import "../styles/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const csrfToken = Cookies.get("csrftoken");
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch(); // Use context

  const handleLogout = () => {
    axios
      .post("http://localhost:8000/api/logout/", {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate("/"); // Redirect using React Router
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  useEffect(() => {
    if (!csrfToken) {
      console.error("CSRF token not found");
      return;
    }

    axios
      .get("http://localhost:8000/api/user/", {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching user data:",
          error.response ? error.response.data : error.message
        );
      });
  }, [csrfToken]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="/images/start.png"
            alt="Logo"
            className="navbar-brand-img"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            {user?.isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/events">
                    Events
                  </Link>
                </li>
                {user?.isStaff && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin_dashboard">
                      Panel
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          <form className="form-inline">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-pink my-2 my-sm-0" type="button">
              Search
            </button>
          </form>
          <ul className="navbar-nav ml-2">
            {user?.isAuthenticated ? (
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
