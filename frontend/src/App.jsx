// src/App.js
import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Events from './components/Events';

function App() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    axios.get('/user')
      .then(res => setCurrentUser(true))
      .catch(error => setCurrentUser(false));
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/register" element={currentUser ? <Navigate to="/start" /> : <Register />} />
        <Route path="/login" element={currentUser ? <Navigate to="/start" /> : <Login />} />
        <Route path="/start" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/events" element={<Events />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
