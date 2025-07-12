// user authentication with cookies

import { use, useEffect, useState } from "react";
import { USER_AUTH } from "../apis/auth.api";
import { UserContext } from "../context/all.context";
export function useAuth() {
  const { setUserDetails } = use(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const fetchUserDetails = async () => {
      let res = await fetch(USER_AUTH, {
        method: "GET",
        credentials: "include",
      });
      if (res.status == 400) {
        setIsAuthenticated(false);
      } else {
        res = await res.json();
        setUserDetails(res.userDetails);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    fetchUserDetails();
  }, [setUserDetails]);
  return { isAuthenticated, isLoading };
}
