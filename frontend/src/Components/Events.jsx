import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css"; // Import the CSS file

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/events/")
      .then((response) => {
        console.log(response.data);
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.error("Data not in table / json");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch data", error);
      });
  }, []);

  return (
    <div className="app-container">
      <h1>Odnajdź swoje upragnione wydarzenie</h1>
      <p></p>
      <div className="search-bar">
        <input type="text" placeholder="Szukaj" className="search-input" />
        <div className="search-filter">
          <span>Data</span>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Wybierz datę"
            className="date-picker"
          />
        </div>
        <div className="search-filter">
          <span>Lokalizacja</span>
          <select>
            <option value="">Wszystkie</option>
            <option value="krakow">Kraków</option>
            <option value="warsaw">Warszawa</option>
            <option value="wroclaw">Wrocław</option>
            <option value="gdansk">Gdańsk</option>
            <option value="poznan">Poznań</option>
            <option value="lodz">Łódź</option>
            <option value="szczecin">Szczecin</option>
          </select>
        </div>
        <button className="search-button">Szukaj</button>
      </div>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.event_ID} className="event-card">
            <img src={event.eventImage} alt="Obrazek" className="event-image" />
            <div className="event-details">
              <h2 className="event-title">{event.title}</h2>
              <p>{event.date}</p>
              <p>{event.location}</p>
              <button className="order-button">Zamów Bilet</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;

