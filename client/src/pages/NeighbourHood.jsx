import { lazy, use, useCallback, useState } from "react";
import {
  CacheColorContext,
  LocationContext,
  NearUserContext,
  UserContext,
} from "../context/all.context";
import { FaLocationArrow } from "react-icons/fa";
import { GET_NEARBY_USERS, MY_LOCATION_DETAILS } from "../apis/auth.api";
import {
  calculateDefinedKey,
  calculateHaverSineDistance,
  randomColorGenerator,
} from "../helpers/user.helper.js";
import { useNavigate } from "react-router-dom";

const NearUserComp = lazy(() => import("../components/NearUserComp.jsx"));

const NeighbourHood = () => {
  const { userDetails, setUserDetails } = use(UserContext);
  const { locationShared, setLocationShared } = use(LocationContext);
  const { nearUsersDetails, setNearUsersDetails } = use(NearUserContext);
  const { cacheUserColor, setCacheUserColor } = use(CacheColorContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  // const intervalRef = useRef(null);
  const navigate = useNavigate();

  /*
  useEffect(() => {
    const updateNearUsers = async () => {
      let res = await fetch(
        GET_NEARBY_USERS +
          `?lat=${userDetails.latitude}&long=${userDetails.longitude}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      res = await res.json();
      setNearUsersDetails((prev) => {
        if (Object.keys(prev).length) {
          let newNearUsers = compareNearUserDetails(prev, res.locationDetails);
          return { ...newNearUsers };
        } else {
          let newNearUsers = {};
          for (let key of Object.keys(res.locationDetails)) {
            let tmp = [];
            for (let obj of res.locationDetails[key]) {
              tmp.push({ ...obj, isShow: false });
            }
            newNearUsers[key] = tmp;
          }
          return { ...newNearUsers };
        }
      });
      setCacheUserColor((prev) => {
        let newUsersColors = {};
        for (let key of Object.keys(res.locationDetails)) {
          for (let obj of res.locationDetails[key]) {
            if (!prev[obj.user_id]) {
              newUsersColors[obj.user_id] = randomColorGenerator();
            }
          }
        }
        return { ...prev, ...newUsersColors };
      });
    };

    if (locationShared && userDetails["latitude"]) {
      intervalRef.current = setInterval(() => {
        updateNearUsers();
      }, 10000);
    }
    return () => clearInterval(intervalRef.current);
  }, [userDetails, locationShared]);

  */

  const handleUserlocation = async () => {
    if (!Object.keys(userDetails).length) return navigate("/login");
    if (!locationShared) {
      setIsLoading(true);
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
            `?lat=${pos.coords.latitude}&long=${pos.coords.longitude}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        res = await res.json();

        let newNearUsers = {};
        let initialColors = {};
        for (let key of Object.keys(res.locationDetails)) {
          let tmp = [];
          for (let obj of res.locationDetails[key]) {
            tmp.push({ ...obj, isShow: false });
            initialColors[obj.user_id] = randomColorGenerator();
          }
          newNearUsers[key] = [...tmp];
        }
        // SSE
        const es = new EventSource(
          "http://localhost:5000/api/v1/event/connect"
        );
        await fetch("http://localhost:5000/api/v1/event/user-detail", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userDetails: {
              ...userDetails,
              ["latitude"]: pos.coords.latitude,
              ["longitude"]: pos.coords.longitude,
            },
            isJoined: true,
          }),
          credentials: "include",
        });

        // event listener of SSE
        es.onmessage = (e) => {
          let data = JSON.parse(e.data);
          if (data.userDetails["user_id"] != userDetails["user_id"]) {
            if (!data["isJoined"]) {
              setNearUsersDetails((prev) => {
                let newUsers = {};
                for (let key in prev) {
                  let tmp = [];
                  for (let obj of prev[key]) {
                    if (obj.user_id != data.userDetails.user_id) tmp.push(obj);
                  }
                  newUsers[key] = [...tmp];
                }
                return { ...newUsers };
              });
              setCacheUserColor((prev) => {
                let newUserCache = {};
                for (let key in prev) {
                  if (key != data.userDetails.user_id)
                    newUserCache[key] = prev[key];
                }
                return { ...newUserCache };
              });
            } else {
              let dis = calculateHaverSineDistance(
                { lat1: pos.coords.latitude, lon1: pos.coords.longitude },
                {
                  lat2: data.userDetails["latitude"],
                  lon2: data.userDetails["longitude"],
                }
              );
              let definedKey = calculateDefinedKey(dis);
              setNearUsersDetails((prev) => {
                let newUsers = {};
                for (let key in prev) {
                  if (key == definedKey) {
                    newUsers[key] = [...prev[key], { ...data.userDetails }];
                  } else {
                    newUsers[key] = [...prev[key]];
                  }
                }
                return { ...newUsers };
              });
              setCacheUserColor((prev) => {
                return {
                  ...prev,
                  [data.userDetails.user_id]: randomColorGenerator(),
                };
              });
            }
          }
        };
        setCacheUserColor({ ...cacheUserColor, ...initialColors });
        setNearUsersDetails({ ...newNearUsers });
        setLocationShared(true);
        setUserDetails({
          ...userDetails,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
      setIsLoading(false);
    }
  };

  const handleMouseOver = useCallback(
    (e, userId) => {
      let newNearUserDetails = {};
      for (let key of Object.keys(nearUsersDetails)) {
        let tmp = [];
        for (let u of nearUsersDetails[key]) {
          if (u.user_id === userId) {
            tmp.push({ ...u, isShow: true });
          } else {
            tmp.push({ ...u });
          }
        }
        newNearUserDetails[key] = [...tmp];
      }
      const position = e
        ? e.currentTarget.getBoundingClientRect()
        : { left: hoverPos["x"], top: hoverPos["y"] };
      setHoverPos({ x: position.left, y: position.bottom });
      setNearUsersDetails({ ...newNearUserDetails });
    },
    [hoverPos, nearUsersDetails, setNearUsersDetails]
  );

  const handleMouseLeave = useCallback(
    (userId) => {
      let newNearUserDetails = {};
      for (let key of Object.keys(nearUsersDetails)) {
        let tmp = [];
        for (let u of nearUsersDetails[key]) {
          if (u.user_id === userId) {
            tmp.push({ ...u, isShow: false });
          } else {
            tmp.push({ ...u });
          }
        }
        newNearUserDetails[key] = [...tmp];
      }
      setNearUsersDetails({ ...newNearUserDetails });
      setHoverPos({ x: 0, y: 0 });
    },
    [nearUsersDetails, setNearUsersDetails]
  );
  if (isLoading)
    return (
      <div className="flex justify-center items-center py-10 font-bold text-white">
        Loading ....
      </div>
    );
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
                      <NearUserComp
                        key={user.user_id}
                        user={user}
                        handleMouseOver={handleMouseOver}
                        handleMouseLeave={handleMouseLeave}
                        hoverPos={hoverPos}
                      />
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

export default NeighbourHood;
