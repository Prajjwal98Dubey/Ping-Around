import { use } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { UserContext } from "../context/all.context.js";
import { MY_LOCATION_DETAILS } from "../apis/auth.api.js";
const Connect = () => {
  const { userDetails, setUserDetails } = use(UserContext);
  const handleUserlocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      await fetch(MY_LOCATION_DETAILS, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: userDetails.user_id,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      });
      setUserDetails({
        ...userDetails,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  };
  return (
    <div className="w-full min-h-screen">
      <div className="mt-14 flex justify-center items-center p-1">
        <button
          onClick={handleUserlocation}
          className={`flex items-center gap-3 bg-gradient-to-r ${
            userDetails["latitude"]
              ? "from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
              : "from-[#3b0764] via-[#0ea5e9] to-[#f59e42] hover:from-[#0ea5e9] hover:to-[#3b0764]"
          } text-white font-bold px-3 py-2 md:px-8 md:py-4 rounded-full shadow-xl hover:scale-105  transition-all duration-300 active:scale-95 font-[Quicksand] text-sm md:text-lg uppercase tracking-wider mx-2 my-1`}
        >
          <FaLocationArrow className="text-white text-sm md:text-xl" />
          {userDetails["latitude"] ? "location on " : "share your location"}
        </button>
      </div>
      <div className="flex justify-center items-center text-xl md:text-4xl font-extrabold text-white">
        Connecting ...
      </div>
    </div>
  );
};

export default Connect;
