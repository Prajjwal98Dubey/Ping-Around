import { createPortal } from "react-dom";
import ViewUser from "./ViewUser.jsx";
import { memo, useState } from "react";
import { randomColorGenerator } from "../helpers/user.helper.js";

const NearUserComp = memo(
  ({ user, handleMouseOver, handleMouseLeave, hoverPos }) => {
    const [hasImageError, setHasImageError] = useState(false);
    return (
      <div
        className="flex px-1 cursor-pointer relative"
        onMouseEnter={(e) => handleMouseOver(e, user.user_id)}
        onMouseLeave={() => handleMouseLeave(user.user_id)}
      >
        <div className="rounded-full px-1 mx-1">
          {user.user_image ? (
            hasImageError ? (
              <div
                style={{ backgroundColor: randomColorGenerator() }}
                className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full flex justify-center items-center text-white font-extrabold"
              >
                {user.first_name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={user.user_image}
                alt="user_image"
                className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full"
                onError={() => setHasImageError(true)}
              />
            )
          ) : (
            <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full bg-[#313131] flex justify-center items-center text-white font-extrabold">
              {user.first_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {user.isShow &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: hoverPos["y"],
                left: hoverPos["x"],
              }}
              className="transition-all duration-300"
            >
              <ViewUser details={user} handleMouseLeave={handleMouseLeave} />
            </div>,
            document.getElementById("modal")
          )}
      </div>
    );
  }
);
export default NearUserComp;
