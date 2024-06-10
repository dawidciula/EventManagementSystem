// src/components/EventForm.js
import React, { useState } from 'react';
import api from '../services/api';

const EventForm = ({ event, onSave }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event?.date || '');
  const [startDate, setStartDate] = useState(event?.start_date || '');
  const [endDate, setEndDate] = useState(event?.end_date || '');
  const [location, setLocation] = useState(event?.location || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { title, description, date, start_date: startDate, end_date: endDate, location };
    try {
      if (event) {
        await api.put(`/events/${event.event_ID}/`, eventData);
      } else {
        await api.post('/events/', eventData);
      }
      onSave();
    } catch (error) {
      console.error('Błąd zapisywania wydarzenia:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tytuł" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opis" required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lokalizacja" required />
      <button type="submit">Zapisz wydarzenie</button>
    </form>
  );
};

export default EventForm;


