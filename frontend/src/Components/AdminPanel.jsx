import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Importuj js-cookie
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Pobieranie tokenu CSRF
  const csrfToken = Cookies.get("csrftoken"); // Pobierz token CSRF z ciasteczka

  // Fetchowanie użytkowników i wydarzeń
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin-dashboard/",
          {
            headers: {
              "X-CSRFToken": csrfToken, // Dodaj token CSRF do nagłówka
            },
            withCredentials: true, // Uwzględnij ciasteczka w żądaniu
          }
        );
        setUsers(response.data.users || []); // Ensure users is always an array
        setEvents(response.data.events || []); // Ensure events is always an array
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/events/", {
          headers: {
            "X-CSRFToken": csrfToken, // Dodaj token CSRF do nagłówka
          },
          withCredentials: true, // Uwzględnij ciasteczka w żądaniu
        });
        setEvents(response.data.events); // Zakładam, że dane wydarzeń są w polu "events"
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Error fetching events");
      }
    };

    fetchUsers();
    fetchEvents();
  }, [csrfToken]);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}/`, {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        });
        setUsers(users.filter((user) => user.user_ID !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Error deleting user");
      }
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8000/api/events/${eventId}/`, {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        });
        setEvents(events.filter((event) => event.event_ID !== eventId));
      } catch (error) {
        console.error("Error deleting event:", error);
        setError("Error deleting event");
      }
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
      <p>Here you can manage users and events.</p>
      <div className="row">
        {/* Sekcja użytkowników */}
        <div className="col-md-6">
          <h2>Users</h2>
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_ID}>
                    <td>{user.user_ID}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <Link
                        to={`/edit_user/${user.user_ID}`}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user.user_ID)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/users_details/${user.user_ID}`}
                        className="btn btn-info btn-sm"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No users available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sekcja wydarzeń */}
        <div className="col-md-6">
          <h2>Events</h2>
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events?.length > 0 ? (
                events.map((event) => (
                  <tr key={event.event_ID}>
                    <td>{event.event_ID}</td>
                    <td>
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="event-thumbnail"
                        />
                      ) : (
                        <img
                          src={"/images/flower.jpg"}
                          alt="Default Image"
                          className="event-thumbnail"
                        />
                      )}
                    </td>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>
                      <Link
                        to={`/edit_event/${event.event_ID}`}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.event_ID)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No events available</td>
                </tr>
              )}
            </tbody>
          </table>
          <Link to="/create_event" className="btn btn-success btn-sm mb-3">
            Create New Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
