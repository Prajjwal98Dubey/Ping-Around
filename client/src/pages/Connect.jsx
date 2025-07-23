/*
---------------------------------------------------------------------- THIS PAGE IS NOT IN USE ------------------------------------------------------------

------------------------------------------------ THIS FUNCTIONALITY IS HANDLED BY THE "/neighbourhood"(Neighbourhood.jsx) -------------------------- 


import { use, useEffect, useRef } from "react";
import { FaLocationArrow } from "react-icons/fa";
import {
  LocationContext,
  NearUserContext,
  UserContext,
} from "../context/all.context.js";
import { GET_NEARBY_USERS, MY_LOCATION_DETAILS } from "../apis/auth.api.js";
import ViewUser from "../components/ViewUser.jsx";
import { createPortal } from "react-dom";
const Connect = () => {
  const { userDetails, setUserDetails } = use(UserContext);
  const { locationShared, setLocationShared } = use(LocationContext); 
  const { nearUsersDetails, setNearUsersDetails } = use(NearUserContext);
  const hoverPosRef = useRef({ x: 0, y: 0 });
  const currentHoveredUserRef = useRef(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  useEffect(() => {
    const updateNearUsers = async () => {
      let res = await fetch(
        GET_NEARBY_USERS +
          `?lat=${userDetails.latitude}&long=${userDetails.longitude}`
      );
      res = await res.json();
      console.log("HOVERING POSITION", hoverPosRef.current["x"]);
      if (hoverPosRef.current["x"] != 0) {
        handleMouseOver(null, currentHoveredUserRef.current);
      }
      setNearUsersDetails({ ...res.locationDetails });
    };

    if (locationShared && userDetails["latitude"]) {
      intervalRef.current = setInterval(() => {
        updateNearUsers();
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [  ]);

  const handleUserlocation = async () => {
    if (!locationShared) {
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
        let res = await fetch(
          GET_NEARBY_USERS +
            `?lat=${pos.coords.latitude}&long=${pos.coords.longitude}`
        );
        res = await res.json();
        setNearUsersDetails({ ...res.locationDetails });
        setLocationShared(true);
        setUserDetails({
          ...userDetails,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    }
  };
  const handleMouseOver = (e, userId) => {
    for (let key of Object.keys(nearUsersDetails)) {
      for (let u of nearUsersDetails[key]) {
        if (u.user_id === userId) {
          u.isShow = true;
        }
      }
    }
    const position = e
      ? e.currentTarget.getBoundingClientRect()
      : { left: hoverPosRef.current["x"], top: hoverPosRef.current["y"] };
    // setCurrentHoveredUserR(userId);
    currentHoveredUserRef.current = userId;
    timerRef.current = setTimeout(() => {
      // setHoverPos({ x: position.left, y: position.top });
      hoverPosRef.current = { x: position.left, y: position.top };
      setNearUsersDetails({ ...nearUsersDetails });
    }, 150);
  };
  const handleMouseLeave = (userId) => {
    for (let key of Object.keys(nearUsersDetails)) {
      for (let u of nearUsersDetails[key]) {
        if (u.user_id === userId) {
          u.isShow = false;
        }
      }
    }
    setNearUsersDetails({ ...nearUsersDetails });
    // setHoverPos({ x: 0, y: 0 });
    hoverPosRef.current = { x: 0, y: 0 };
    // setCurrentHoveredUser("");
    currentHoveredUserRef.current = null;
    clearTimeout(timerRef.current);
    timerRef.current = null;
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
      {!locationShared && (
        <div className="flex justify-center items-center text-lg md:text-3xl font-extrabold text-gray-500 py-2">
          Share Location to find nearest users...
        </div>
      )}
      


      {locationShared && (
        <div className="flex justify-center w-full h-full mx-2 md:mx-6">
          <div className="w-full h-full">
            {Object.keys(nearUsersDetails).map((dis) => (
              <div key={dis} className="p-8">
                <div className="relative w-[95%] h-[5px] bg-gray-500 my-2 flex justify-center rounded-l-[130px] rounded-r-[30px]">
                  <div className="absolute right-0 top-1 text-white font-bold">
                    <div className="p-2 rounded-[25px] text-[12px] md:text-lg ">
                      {dis == 11 ? "Far Away" : `Within ${dis} km`}
                    </div>
                  </div>
                  <div className="absolute left-0 transform -translate-y-1/2 top-1/2 flex">
                    {nearUsersDetails[dis].map((user) => (

                       // NearUserComp.jsx
                      <div
                        className="flex px-1 cursor-pointer relative"
                        key={user.user_id}
                        onMouseEnter={(e) => handleMouseOver(e, user.user_id)}
                        onMouseLeave={() => handleMouseLeave(user.user_id)}
                      >
                        <div className="rounded-full px-1 mx-1">
                          {user.user_image ? (
                            <img
                              src={user.user_image}
                              alt="user_image"
                              className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full"
                            />
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
                                top: hoverPosRef.current["y"],
                                left: hoverPosRef.current["x"],
                              }}
                              className="transition-all duration-300"
                            >
                              <ViewUser
                                details={user}
                                handleMouseLeave={handleMouseLeave}
                              />
                            </div>,
                            document.getElementById("modal")
                          )}
                      </div>


                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Connect;

*/
