import { use, useEffect } from "react";
import { VALIDATE_GOOGLE_AUTH } from "../apis/auth.api.js";
import { useNavigate } from "react-router-dom";
import {
  AuthContext,
  CacheColorContext,
  UserContext,
} from "../context/all.context.js";
import { randomColorGenerator } from "../helpers/user.helper.js";
function GoogleAuth() {
  const navigate = useNavigate();
  const { setUserDetails } = use(UserContext);
  const { setIsAuthenticated, setIsLoading } = use(AuthContext);
  const { cacheUserColor, setCacheUserColor } = use(CacheColorContext);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  useEffect(() => {
    setTimeout(() => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    }, 1500);
  }, []);

  const handleCredentialResponse = async (response) => {
    let res = await fetch(VALIDATE_GOOGLE_AUTH, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ idToken: response.credential }),
      credentials: "include",
    });
    res = await res.json();
    setCacheUserColor({
      ...cacheUserColor,
      [res.userDetails.user_id]: randomColorGenerator(),
    });
    setUserDetails({ ...res.userDetails });
    setIsAuthenticated(true);
    setIsLoading(false);
    navigate("/");
  };

  return <div id="google-signin-button"></div>;
}

export default GoogleAuth;
