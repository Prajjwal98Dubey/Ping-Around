import { useState } from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  const [hasImageError, setHasImageError] = useState(false);
  return (
    <div className="fixed top-3 left-3 ">
      <Link to="/">
        {hasImageError ? (
          <div className="w-[45px] h-[45px] rounded-full bg-[#313131] text-white font-bold flex justify-center items-center">
            PG
          </div>
        ) : (
          <img
            src="ping-logo.gif"
            alt="loading"
            className="w-[45px] h-[45px] rounded-full"
            onError={() => setHasImageError(true)}
          />
        )}
      </Link>
    </div>
  );
};

export default Logo;
