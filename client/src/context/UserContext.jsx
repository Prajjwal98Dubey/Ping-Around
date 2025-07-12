import { useState } from "react";
import { UserContext } from "./all.context.js";

function UserContextProvider({ children }) {
  const [userDetails, setUserDetails] = useState({});
  return (
    <UserContext value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext>
  );
}

export default UserContextProvider;
