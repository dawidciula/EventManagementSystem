import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

const UserDetailPage = () => {
  const { userId } = useParams(); // Zakładamy, że userId jest przekazywane w parametrach URL
  const [user, setUser] = useState(null);
  const [eventsJoined, setEventsJoined] = useState([]);
  const [error, setError] = useState(null);
  const csrfToken = Cookies.get("csrftoken");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Pobranie danych o użytkowniku
        const userResponse = await axios.get(
          `http://localhost:8000/api/users-details/${userId}`,
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
        setUser(userResponse.data);

        const eventsResponse = await axios.get(
          `http://localhost:8000/api/users-details/${userId}`,
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
        setEventsJoined(eventsResponse.data.registered_events);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user details.");
      }
    };

    fetchUserData();
  }, [csrfToken, userId]);

  if (error) return <div className="alert alert-danger">{error}</div>;

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>User Detail</h1>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <h2>Events Joined:</h2>
      <ul className="list-group">
        {eventsJoined.length > 0 ? (
          eventsJoined.map((event) => (
            <li key={event.event_ID} className="list-group-item">
              {event.title}
            </li>
          ))
        ) : (
          <li className="list-group-item">No events joined.</li>
        )}
      </ul>
    </div>
  );
};

export default UserDetailPage;
