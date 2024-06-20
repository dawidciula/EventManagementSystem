import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import NavigationBar from "./Components/Navbar.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import { Nav } from "react-bootstrap";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NavigationBar></NavigationBar>
    <App />
  </React.StrictMode>
);
