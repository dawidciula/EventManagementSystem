import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Zamiast useHistory
import client from '../axiosConfig'; // Upewnij się, że importujesz poprawny plik konfiguracyjny Axios

const NavBar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); // Zamiast useHistory


  return (
    <nav>
      <ul>
        <li><Link to="/">Strona główna</Link></li>
        <li><Link to="/events">Wydarzenia</Link></li>
        {currentUser && currentUser.is_superuser && (
          <li><Link to="/admin_dashboard">Panel Admina</Link></li>
        )}
        {currentUser ? (
          <>
            <li><button onClick={handleLogout}>Wyloguj</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Logowanie</Link></li>
            <li><Link to="/register">Rejestracja</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
