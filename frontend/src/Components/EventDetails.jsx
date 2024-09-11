import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

const EventDetail = () => {
  const { eventId } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const csrfToken = Cookies.get("csrftoken");

  // Function to fetch event data
  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/events/${eventId}/`,
        {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      );
      setEvent(response.data);
      setIsRegistered(response.data.is_registered);
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError("Error fetching event data");
    }
  }, [eventId, csrfToken]);

  // Function to handle event join and leave actions
  const handleEventAction = async (action) => {
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
        setIsRegistered(true);
        setSuccessMessage("Successfully joined the event!");
      } else if (action === "leave") {
        await axios.post(
          `http://localhost:8000/api/events/${eventId}/leave/`,
          null,
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
        setIsRegistered(false);
        setSuccessMessage("Successfully left the event!");
      }
    } catch (error) {
      console.error(`Error ${action} event:`, error);
      setError(`Error ${action} the event`);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!event) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="event-card card">
        <img
          src={event.image ? event.image : "/images/flower.jpg"}
          className="card-img-top"
          alt={event.title}
        />
        <div className="card-body">
          <h1>{event.title}</h1>
          <p>Date: {event.date}</p>
          <p>Start Time: {new Date(event.start_date).toLocaleTimeString()}</p>
          <p>End Time: {new Date(event.end_date).toLocaleTimeString()}</p>
          <p>Description: {event.description}</p>
          <p>Location: {event.location}</p>
          <p>Status: {event.status}</p>
          <p>Organizer: {event.organizer_ID}</p>

          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {isRegistered ? (
            <button
              onClick={() => handleEventAction("leave")}
              className="btn btn-danger"
            >
              Leave Event
            </button>
          ) : (
            <button
              onClick={() => handleEventAction("join")}
              className="btn btn-success"
            >
              Join Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
