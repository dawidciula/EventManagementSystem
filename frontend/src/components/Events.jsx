import React, { useState, useEffect } from 'react';
import client from '../axiosConfig';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [userRegisteredEvents, setUserRegisteredEvents] = useState(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsResponse = await client.get('/events/');
        setUserRegisteredEvents(new Set(eventsResponse.data.map(event => event.id)));
        setEvents(eventsResponse.data || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load data');
      }
    };

    fetchEvents();
  }, []);

  const handleJoinEvent = async (eventId) => {
    try {
      await client.post(`/join_event/${eventId}/`);
      setUserRegisteredEvents(new Set([...userRegisteredEvents, eventId]));
    } catch (error) {
      console.error(`Failed to join event with ID: ${eventId}`, error);
      setError('Failed to join event');
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      await client.post(`/events/${eventId}/delete_event/`);
      const updatedEvents = new Set(userRegisteredEvents);
      updatedEvents.delete(eventId);
      setUserRegisteredEvents(updatedEvents);
    } catch (error) {
      console.error(`Failed to leave event with ID: ${eventId}`, error);
      setError('Failed to leave event');
    }
  };

  const handleEditEvent = async (eventId) => {
    // Handle edit event action
    try {
      // Implement edit event action
    } catch (error) {
      console.error(`Failed to edit event with ID: ${eventId}`, error);
      setError('Failed to edit event');
    }
  };

  const handleDeleteEvent = async (event_ID) => {
    console.log(event_ID); // Dodaj ten wiersz
    try {
      await client.post(`/delete_event/${event_ID}/`);
      setEvents(events.filter(event => event.id !== event_ID));
    } catch (error) {
      console.error(`Failed to delete event with ID: ${event_ID}`, error);
      setError('Failed to delete event');
    }
  };

  const handleCreateEvent = async () => {
    // Handle create event action
    try {
      // Implement create event action
    } catch (error) {
      console.error('Failed to create event', error);
      setError('Failed to create event');
    }
  };

  return (
    <Container>
      <h2 className="my-4">Wydarzenia</h2>
      {error && <p className="error-message">{error}</p>}
      <Row xs={1} md={2} lg={3} className="g-4">
        {events.map(event => (
          <Col key={event.id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Button variant={userRegisteredEvents.has(event.id) ? "danger" : "primary"} onClick={() => userRegisteredEvents.has(event.id) ? handleLeaveEvent(event.id) : handleJoinEvent(event.id)}>
                  {userRegisteredEvents.has(event.id) ? "Rezygnuj" : "Dołącz"}
                </Button>
                <Button variant="info" className="ms-2" onClick={() => handleEditEvent(event.id)}>Edytuj</Button>
                <Button variant="danger" className="ms-2" onClick={() => handleDeleteEvent(event.event_ID)}>Usuń</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="success" className="my-4" onClick={handleCreateEvent}>Utwórz nowe wydarzenie</Button>
    </Container>
  );
};

export default Event;
