// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav>
    <ul>
      <li><Link to="/">Strona główna</Link></li>
      <li><Link to="/events">Wydarzenia</Link></li>
      <li><Link to="/dashboard">Panel Admina</Link></li>
      <li><Link to="/login">Logowanie</Link></li>
      <li><Link to="/register">Rejestracja</Link></li>
    </ul>
  </nav>
);

export default NavBar;

