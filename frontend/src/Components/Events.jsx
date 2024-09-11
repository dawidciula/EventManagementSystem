import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState({ registered_events: [] });
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const csrfToken = Cookies.get("csrftoken");

  // Function to fetch events
  const fetchEvents = useCallback(async () => {
    try {
      const eventsResponse = await axios.get(
        "http://localhost:8000/api/events/"
      );
      console.log("Events data received:", eventsResponse.data);
      setEvents(eventsResponse.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Error fetching events");
    }
  }, []);

  // Function to fetch user information
  const fetchUser = useCallback(async () => {
    try {
      const userResponse = await axios.get("http://localhost:8000/api/user/", {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      });
      console.log("User data received:", userResponse.data);
      setUser(userResponse.data || { registered_events: [] });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Error fetching user data");
    }
  }, [csrfToken]);

  // Function to handle event join and leave actions
  const handleEventAction = async (eventId, action) => {
    console.log(`Handling ${action} for event ${eventId}`);
    try {
      if (action === "join") {
        await axios.post(
          `http://localhost:8000/api/events/${eventId}/join/`,
          null,
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
      } else if (action === "leave") {
        await axios.post(
          `http://localhost:8000/api/events/${eventId}/leave/`,
          null,
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
      }
      // Refresh user data and events list after action
      await fetchUser(); // Use fetchUser from useCallback
      const eventsResponse = await axios.get(
        "http://localhost:8000/api/events/"
      );
      setEvents(eventsResponse.data);
      setMessages(["Event updated successfully"]);
    } catch (error) {
      console.error(`Error ${action} event:`, error);
      setError(`Error ${action} event`);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUser();
  }, [fetchEvents, fetchUser]);

  // Debug: Log user data and events data
  console.log("User registered events:", user.registered_events);
  console.log("Events:", events);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!events.length) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>Events</h1>
      <div className="list-group">
        {events.map((event) => (
          <div key={event.event_ID} className="list-group-item">
            <h2>
              <Link to={`/events/${event.event_ID}`}>{event.title}</Link>
            </h2>
            <p>Date: {event.date}</p>
            <p>Description: {event.description}</p>
            {user && (
              <>
                {Array.isArray(user.registered_events) &&
                user.registered_events.includes(event.event_ID) ? (
                  <button
                    onClick={() => handleEventAction(event.event_ID, "leave")}
                    className="btn btn-danger"
                  >
                    Leave Event
                  </button>
                ) : (
                  <button
                    onClick={() => handleEventAction(event.event_ID, "join")}
                    className="btn btn-success"
                  >
                    Join Event
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div>
        {messages.map((message, index) => (
          <div key={index} className="alert alert-info">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;
