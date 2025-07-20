import { useState } from "react";
import { LocationContext } from "./all.context";

function LocationContextProvider({ children }) {
  const [locationShared, setLocationShared] = useState(false);
  return (
    <LocationContext.Provider value={{ locationShared, setLocationShared }}>
      {children}
    </LocationContext.Provider>
  );
}

export default LocationContextProvider;
