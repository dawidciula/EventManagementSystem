// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import AdminDashboard from './pages/AdminDashboard';

const App = () => (
  <Router>
    <NavBar />
    <Routes>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/events" exact component={EventList} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/dashboard" component={AdminDashboard} />
    </Routes>
  </Router>
);

export default App;



