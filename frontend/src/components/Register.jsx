// src/components/Register.jsx
import React, { useState } from 'react';
import client from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    client.post('/register', {
      email: email,
      username: username,
      password: password,
    })
    .then(response => {
      // Przekieruj użytkownika do strony logowania po udanej rejestracji
      navigate('/login');
    })
    .catch(error => {
      // Wyświetl błąd rejestracji
      setError('Registration failed');
    });
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formUsername">
          <Form.Label>Nazwa użytkownika</Form.Label>
          <Form.Control 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Hasło</Form.Label>
          <Form.Control 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        {error && <p className="error-message">{error}</p>}
        <Button variant="primary" type="submit">
          Zarejestruj się
        </Button>
      </Form>
    </div>
  );
};

export default Register;
