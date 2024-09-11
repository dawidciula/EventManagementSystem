import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Adjust the base URL if necessary

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/events/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
