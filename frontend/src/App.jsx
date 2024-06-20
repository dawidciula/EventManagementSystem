import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"; // Import the CSS file
import Register from "./Components/Register";
import Events from "./Components/Events";
import Login from "./Components/Login";

const App = () => {
  
  return (
    <Router>
    <div className="app-container">
      <Routes>
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  </Router>
  )
};

export default App;

