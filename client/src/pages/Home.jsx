import "@fontsource/quicksand/700.css";
import "@fontsource/quicksand/400.css";
import Navbar from "../components/Navbar";
import Info from "../components/Info";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../custom-hooks/useAuth";

function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  if (isLoading) return <h1>Loading...</h1>;
  if (!isAuthenticated) return navigate("/login");
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#18181b] via-[#232526] to-[#0f2027] px-4 font-[Quicksand] overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#3b0764] opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -bottom-32 right-0 w-96 h-96 bg-[#0ea5e9] opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-[#f59e42] opacity-20 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
      <Navbar />
      <Outlet />
      <Info />
    </div>
  );
}

export default Home;
