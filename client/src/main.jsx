import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserContextProvider from "./context/UserContext.jsx";
import LocationContextProvider from "./context/LocationContextProvider.jsx";
import NearUserContextProvider from "./context/NearUserContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <LocationContextProvider>
      <NearUserContextProvider>
        <App />
      </NearUserContextProvider>
    </LocationContextProvider>
  </UserContextProvider>
);
