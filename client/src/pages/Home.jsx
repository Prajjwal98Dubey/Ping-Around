import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#18181b] via-[#232526] to-[#0f2027] font-[Quicksand] overflow-hidden">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Home;
