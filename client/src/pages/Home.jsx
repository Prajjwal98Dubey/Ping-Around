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
      <Navbar />
      <Outlet />
      <Info />
    </div>
  );
}

export default Home;
