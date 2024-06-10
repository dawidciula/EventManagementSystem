// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import EventForm from '../components/EventForm';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const handleSave = async () => {
    const response = await api.get('/events/');
    setEvents(response.data);
    setSelectedEvent(null);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}/`);
      setEvents(events.filter(event => event.event_ID !== id));
    } catch (error) {
      console.error('Błąd usuwania wydarzenia:', error);
    }
  };

  return (
    <div>
      <h1>Panel Admina</h1>
      <EventForm event={selectedEvent} onSave={handleSave} />
      <ul>
        {events.map(event => (
          <li key={event.event_ID}>
            {event.title}
            <button onClick={() => handleEdit(event)}>Edytuj</button>
            <button onClick={() => handleDelete(event.event_ID)}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;

