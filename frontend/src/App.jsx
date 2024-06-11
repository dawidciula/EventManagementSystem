import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [Events, setEvent] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/events/")
      .then((Response) => {
        console.log(Response.data);
        if (Array.isArray(Response.data)) {
          setEvent(Response.data);
        } else {
          console.error("Data not in table / json"); //! Delete after debug test
        }
      })
      .catch((error) => {
        console.error("Failed to fetch data", error);
      });
  }, []);

  return (
    <div>
      <h1>Odnajdź swoje upragnione wydarzenie</h1>
      <ul>
        {Events.map((event) => (
          <li key={event.event_ID}>{event.title},</li>
          //* Potem do dodania obrazek <img src={event.eventImage} alt="Obrazek"/>
        ))}
      </ul>
    </div>
  );
};

export default App;
