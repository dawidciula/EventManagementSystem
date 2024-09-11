// src/components/HomePage.jsx
import { useEffect, useState } from "react";
import { useSearch } from "../components/SearchContext"; // Import useSearch
import { getEvents } from "../api";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import "../styles/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const { searchQuery } = useSearch(); // Use context
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error loading events:", error);
        setError("Error loading events");
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {filteredEvents.map((event) => (
          <div key={event.event_ID} className="col-lg-4 mb-4">
            <Link to={`/events/${event.event_ID}`} className="card-link">
              <div className="card">
                <img
                  src={event.image ? event.image : "/images/flower.jpg"}
                  className="card-img-top"
                  alt={event.title}
                />
                <div className="card-body">
                  <h4 className="card-title">{event.title}</h4>
                  <p className="card-text">{event.description}</p>
                  <h5 className="card-text">{event.date}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
