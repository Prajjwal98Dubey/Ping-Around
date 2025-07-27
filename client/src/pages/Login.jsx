import GoogleAuth from "../components/GoogleAuth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { cache, use, useState } from "react";
import { LOGIN_USER } from "../apis/auth.api";
import {
  AuthContext,
  CacheColorContext,
  UserContext,
} from "../context/all.context";
import Logo from "../components/Logo.jsx";
import { randomColorGenerator } from "../helpers/user.helper.js";

function Login() {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const { setUserDetails } = use(UserContext);
  const { isAuthenticated, setIsAuthenticated, setIsLoading } =
    use(AuthContext);
  const { cacheUserColor, setCacheUserColor } = use(CacheColorContext);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (formDetails.email.length == 0 || formDetails.password.length == 0)
      return alert("Enter all mandatory field");
    let res = await fetch(LOGIN_USER, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: formDetails.email,
        password: formDetails.password,
      }),
      credentials: "include",
    });
    if (res.status == 400) return alert("user not present");
    else if (res.status == 401) return alert("wrong password");
    res = await res.json();
    if (res.isThirdParyLogin) return alert("Login through Google !!!");
    setUserDetails(res.userDetails);
    setIsAuthenticated(true);
    if (!cache[res.userDetails.user_id])
      setCacheUserColor({
        ...cacheUserColor,
        [res.userDetails.user_id]: randomColorGenerator(),
      });
    setIsLoading(false);
    navigate("/");
  };

  if (isAuthenticated) return <Navigate to="/neighbourhood" replace />;

  return (
    <>
      <Logo />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#18181b] via-[#232526] to-[#0f2027] px-4 font-[Quicksand]">
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-[#f59e42] via-[#0ea5e9] to-[#3b0764] bg-clip-text text-transparent mb-2 font-[Quicksand]">
            Sign In
          </h2>
          <GoogleAuth />
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-gray-400 opacity-30"></div>
            <span className="text-gray-300 text-xs font-semibold">or</span>
            <div className="flex-1 h-px bg-gray-400 opacity-30"></div>
          </div>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formDetails.email}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  [e.target.name]: e.target.value,
                })
              }
              className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formDetails.password}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  [e.target.name]: e.target.value,
                })
              }
              className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition"
              required
            />
            <button
              type="submit"
              onClick={handleLogin}
              className="bg-gradient-to-r from-[#3b0764] via-[#0ea5e9] to-[#f59e42] text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 text-lg"
            >
              Sign in
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-2">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-[#0ea5e9] font-semibold cursor-pointer hover:underline">
                Sign up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
