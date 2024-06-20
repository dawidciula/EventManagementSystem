import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import "../styles/AdminPanel.css"; // Importuj plik stylów dla AdminPanel

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [editEventData, setEditEventData] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    location: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users: ", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/events/");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events: ", error);
    }
  };

  const handleUserFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register/", formData);
      setShowUserModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to register user: ", error);
    }
  };

  const handleEventFormChange = (e) => {
    setEditEventData({ ...editEventData, [e.target.name]: e.target.value });
  };

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    const updatedEvent = {
      title: editEventData.title,
      description: editEventData.description,
      date: editEventData.date,
      location: editEventData.location,
    };
    try {
      await axios.put(`http://localhost:8000/events/${editEventData.id}/`, updatedEvent);
      setShowEditEventModal(false);
      fetchEvents();
    } catch (error) {
      console.error(`Failed to update event ${editEventData.id}: `, error);
    }
  };

  const openEditEventModal = (event) => {
    setEditEventData({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
    });
    setShowEditEventModal(true);
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8000/events/${eventId}/`);
      fetchEvents();
    } catch (error) {
      console.error(`Failed to delete event ${eventId}: `, error);
    }
  };

  return (
    <div className="app-container">
      <h1>Admin Panel</h1>
      <Button onClick={() => setShowUserModal(true)}>Add User</Button>
      <Button onClick={() => setShowEventModal(true)}>Add Event</Button>

      {/* Modal for adding users */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserFormSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={handleUserFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleUserFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleUserFormChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for adding events */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEventFormSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                onChange={handleEventFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                onChange={handleEventFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                name="date"
                placeholder="YYYY-MM-DD"
                onChange={handleEventFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                onChange={handleEventFormChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for editing events */}
      <Modal show={showEditEventModal} onHide={() => setShowEditEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEventFormSubmit}>
            <Form.Group controlId="formEditTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editEventData.title}
                onChange={handleEventFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEditDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editEventData.description}
                onChange={handleEventFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEditDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                name="date"
                placeholder="YYYY-MM-DD"
                value={editEventData.date}
                onChange={handleEventFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEditLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editEventData.location}
                onChange={handleEventFormChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Users table */}
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="danger" onClick={() => deleteUser(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Events table */}
      <h2>Events</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td>
                <Button variant="info" onClick={() => openEditEventModal(event)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => deleteEvent(event.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;