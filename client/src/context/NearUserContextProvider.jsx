import { useState } from "react";
import { NearUserContext } from "./all.context";

function NearUserContextProvider({ children }) {
  const [nearUsersDetails, setNearUsersDetails] = useState({});
  return (
    <NearUserContext.Provider value={{ nearUsersDetails, setNearUsersDetails }}>
      {children}
    </NearUserContext.Provider>
  );
}

export default NearUserContextProvider;
