import { use } from "react";
import { FaUserCircle } from "react-icons/fa";
import { UserContext } from "../context/all.context.js";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { userDetails } = use(UserContext);
  return (
    <>
      <Link to="/">
        <div className="absolute top-4 left-4 z-10 w-fit h-fit">
          <img
            src="/ping-logo.gif"
            alt="logo"
            className="w-[45px] h-[45px] rounded-full"
          />
        </div>
      </Link>
      <div className="absolute top-4 right-4 z-10">
        {Object.keys(userDetails).length ? (
          userDetails.user_image ? (
            <Link to="/me">
              <img
                src={userDetails.user_image}
                className="w-[40px] h-[40px] rounded-full"
                alt="user_image"
              />
            </Link>
          ) : (
            <Link to="/me">
              <FaUserCircle className="text-[#f59e42] text-4xl md:text-5xl drop-shadow-xl hover:scale-110 transition-transform" />
            </Link>
          )
        ) : (
          <Link to="/login">
            <button className="flex justify-center items-center  text-white font-bold px-5 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#3b0764] rounded-full  hover:scale-105 transition-all duration-300">
              Login
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
