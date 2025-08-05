import { use, useState } from "react";
import { CacheColorContext, UserContext } from "../context/all.context.js";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { userDetails } = use(UserContext);
  const { cacheUserColor } = use(CacheColorContext);
  const [hasImageError, setHasImageError] = useState(false);
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
              {hasImageError ? (
                <div
                  style={{
                    backgroundColor: cacheUserColor[userDetails.user_id]
                      ? cacheUserColor[userDetails.user_id]
                      : "black",
                  }}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#0ea5e9] shadow flex justify-center items-center font-extrabold text-white"
                >
                  {userDetails.first_name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <img
                  src={userDetails.user_image}
                  className="w-[40px] h-[40px] rounded-full"
                  alt="user_image"
                  onError={() => setHasImageError(true)}
                />
              )}
            </Link>
          ) : (
            <Link to="/me">
              <div
                style={{
                  backgroundColor: cacheUserColor[userDetails.user_id]
                    ? cacheUserColor[userDetails.user_id]
                    : "black",
                }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#0ea5e9] shadow flex justify-center items-center font-extrabold text-white"
              >
                {userDetails.first_name.charAt(0).toUpperCase()}
              </div>
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
