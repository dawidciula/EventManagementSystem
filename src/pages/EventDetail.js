// src/pages/EventDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}/`);
        setEvent(response.data);
      } catch (error) {
        console.error('Błąd pobierania szczegółów wydarzenia:', error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>{event.location}</p>
      <p>{event.date}</p>
      <p>{event.start_date} - {event.end_date}</p>
    </div>
  );
};

export default EventDetail;
