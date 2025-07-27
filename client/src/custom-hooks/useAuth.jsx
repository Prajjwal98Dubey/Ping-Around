// user authentication with cookies

import { use, useEffect, useState } from "react";
import { USER_AUTH } from "../apis/auth.api";
import {
  AuthContext,
  CacheColorContext,
  UserContext,
} from "../context/all.context.js";
import { randomColorGenerator } from "../helpers/user.helper.js";
export function useAuth() {
  const { setUserDetails } = use(UserContext);
  const [loading, setLoading] = useState(true);
  const [checkAuth, setCheckAuth] = useState(false);
  const { setIsAuthenticated, setIsLoading } = use(AuthContext);
  const { cacheUserColor, setCacheUserColor } = use(CacheColorContext);
  useEffect(() => {
    const fetchUserDetails = async () => {
      let res = await fetch(USER_AUTH, {
        method: "GET",
        credentials: "include",
      });
      if (res.status == 204 || res.status == 400) {
        setCheckAuth(false);
      } else {
        res = await res.json();
        setUserDetails(res.userDetails);
        setCheckAuth(true);
        setIsAuthenticated(true);
        setCacheUserColor({
          ...cacheUserColor,
          [res.userDetails.user_id]: randomColorGenerator(),
        });
      }
      setLoading(false);
      setIsLoading(false);
    };
    fetchUserDetails();
  }, []);
  return { checkAuth, loading };
}
