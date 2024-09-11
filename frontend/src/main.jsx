import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { SearchProvider } from "./components/SearchContext"; // Import SearchProvider

import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SearchProvider>
      <App />
    </SearchProvider>
  </StrictMode>
);
