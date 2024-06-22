import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css"; // Import the CSS file

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/events/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEvents(response.data);
          setFilteredEvents(response.data);
        } else {
          console.error("Data not in table / json");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch data", error);
      });
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, selectedDate, selectedLocation]);

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      const selectedDateString = selectedDate.toLocaleDateString('sv-SE');
      filtered = filtered.filter(event => event.date === selectedDateString);
      console.log("Filtering by date:", selectedDateString, filtered);
    }

    if (selectedLocation) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  };

  const handleOrderTicket = (eventId) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    axios
      .post(`http://127.0.0.1:8000/events/${eventId}/join/`)
      .then((response) => {
        setLoading(false);
        setSuccessMessage("Pomyślnie zapisano na wydarzenie");
        // Optionally update the event list to reflect the change
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 403) {
          setErrorMessage("Musisz być zalogowany, aby zapisać się na wydarzenie");
        } else {
          setErrorMessage("Błąd przy zapisywaniu na wydarzenie");
        }
      });
  };

  return (
    <div className="app-container">
      <h1>Odnajdź swoje upragnione wydarzenie</h1>
      <p></p>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Szukaj"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="search-filter">
          <span>Data</span>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Wybierz datę"
            className="date-picker"
          />
        </div>
        <div className="search-filter">
          <span>Lokalizacja</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Wszystkie</option>
            <option value="Kraków">Kraków</option>
            <option value="Warszawa">Warszawa</option>
            <option value="Wrocław">Wrocław</option>
            <option value="Gdańsk">Gdańsk</option>
            <option value="Poznań">Poznań</option>
            <option value="Łódź">Łódź</option>
            <option value="Szczecin">Szczecin</option>
          </select>
        </div>
      </div>
      {loading && <div className="loading">Ładowanie...</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div key={event.event_ID} className="event-card">
            <img src={event.eventImage} alt="Obrazek" className="event-image" />
            <div className="event-details">
              <h2 className="event-title">{event.title}</h2>
              <p>{event.date}</p>
              <p>{event.location}</p>
              <button className="order-button" onClick={() => handleOrderTicket(event.event_ID)}>Zamów Bilet</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
