import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserContextProvider from "./context/UserContext.jsx";
import LocationContextProvider from "./context/LocationContextProvider.jsx";
import NearUserContextProvider from "./context/NearUserContextProvider.jsx";
import AuthContextProvider from "./context/AuthContextProvider.jsx";
import CacheColorContextProvider from "./context/CacheColorContextProviders.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <UserContextProvider>
      <LocationContextProvider>
        <CacheColorContextProvider>
          <NearUserContextProvider>
            <App />
          </NearUserContextProvider>
        </CacheColorContextProvider>
      </LocationContextProvider>
    </UserContextProvider>
  </AuthContextProvider>
);
