import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

const EditUser = () => {
  const { userId } = useParams(); // Pobieramy ID użytkownika z URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const csrfToken = Cookies.get("csrftoken");
  const [error, setError] = useState(null);

  // Funkcja do pobierania danych użytkownika z API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${userId}/`,
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
      }
    };

    fetchUser();
  }, [csrfToken, userId]);

  // Funkcja obsługująca zmianę wartości w polach formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funkcja obsługująca przesyłanie formularza
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8000/api/users/${userId}/`, formData);
      navigate("/admin_dashboard"); // Przekierowanie po udanej aktualizacji
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Error updating user");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Edit User</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin_dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditUser;
