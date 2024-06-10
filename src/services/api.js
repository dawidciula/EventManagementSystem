
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.135:3000', // Zmień na adres swojego backendu
});

export default api;


