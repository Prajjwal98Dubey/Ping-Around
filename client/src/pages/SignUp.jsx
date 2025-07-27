import { use, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../apis/auth.api";
import {
  AuthContext,
  CacheColorContext,
  UserContext,
} from "../context/all.context";
import Logo from "../components/Logo";
import { randomColorGenerator } from "../helpers/user.helper";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserDetails } = use(UserContext);
  const { isAuthenticated, setIsAuthenticated, setIsLoading } =
    use(AuthContext);
  const { cacheUserColor, setCacheUserColor } = use(CacheColorContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    let res = await fetch(REGISTER_USER, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: form.email, password: form.password }),
      credentials: "include",
    });
    if (res.status == 409) {
      navigate("/login");
      return;
    }
    res = await res.json();
    setUserDetails(res.userDetails);
    setIsAuthenticated(true);
    setIsLoading(false);
    setCacheUserColor({
      ...cacheUserColor,
      [res.userDetails.user_id]: randomColorGenerator(),
    });
    navigate("/");
    return;
  };

  if (isAuthenticated) return <Navigate to="/neighbourhood" replace />;

  return (
    <>
      <Logo />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#18181b] via-[#232526] to-[#0f2027] px-4 font-[Quicksand]">
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-[#f59e42] via-[#0ea5e9] to-[#3b0764] bg-clip-text text-transparent mb-2 font-[Quicksand]">
            Sign Up
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {error && (
              <div className="text-red-500 text-center text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#3b0764] via-[#0ea5e9] to-[#f59e42] text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 text-lg"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-2">
            Already have an account?{" "}
            <Link to="/login">
              <span className="text-[#0ea5e9] font-semibold cursor-pointer hover:underline">
                Sign in
              </span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
