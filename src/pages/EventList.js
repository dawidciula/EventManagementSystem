// src/pages/EventList.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/');
        setEvents(response.data);
      } catch (error) {
        console.error('Błąd pobierania wydarzeń:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Wydarzenia</h1>
      <ul>
        {events.map(event => (
          <li key={event.event_ID}>
            <Link to={`/events/${event.event_ID}`}>{event.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;


