import { use, useReducer, useState } from "react";
import {
  FaMapMarkerAlt,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaInstagram,
  FaReddit,
  FaUserEdit,
} from "react-icons/fa";
import {
  AuthContext,
  CacheColorContext,
  LocationContext,
  NearUserContext,
  UserContext,
} from "../context/all.context.js";
import { profileReducer } from "../helpers/reducers/profile.reducer.js";
import { Link, useNavigate } from "react-router-dom";
import { LOGOUT_USER } from "../apis/auth.api.js";

const USER_SOCIALS = [
  {
    name: "user_linkedin",
    icon: <FaLinkedin className="text-[#0ea5e9] text-xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
  },
  {
    name: "user_facebook",
    icon: <FaFacebook className="text-[#0ea5e9] text-xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
  },
  {
    name: "user_github",
    icon: <FaGithub className="text-[#0ea5e9] text-xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
  },
  {
    name: "user_instagram",
    icon: <FaInstagram className="text-[#0ea5e9] text-xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
  },
  {
    name: "user_reddit",
    icon: <FaReddit className="text-[#0ea5e9] text-xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
  },
  {
    name: "user_twitter",
    icon: <FaTwitter className="text-[#0ea5e9] text-xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
  },
  {
    name: "user_random_social",
    icon: <FaGlobe className="text-[#0ea5e9] text-xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
  },
];

const MyProfile = () => {
  const { userDetails, setUserDetails } = use(UserContext);
  const { setNearUsersDetails } = use(NearUserContext);
  const { setLocationShared } = use(LocationContext);
  const { setIsAuthenticated } = use(AuthContext);
  const [hasImageError, setHasImageError] = useState(false);
  const { cacheUserColor } = use(CacheColorContext);
  const [state, profileDispatch] = useReducer(profileReducer, {
    ...userDetails,
  });
  const navigate = useNavigate();

  const handleUserLogout = async () => {
    let res = await fetch(LOGOUT_USER, {
      method: "POST",
      credentials: "include",
    });
    if (res.status == 200) {
      setUserDetails({});
      setNearUsersDetails({});
      setLocationShared(false);
      setIsAuthenticated(false);
      navigate("/");
    }
  };
  const calculateUserGeneralInfoGridDimension = () => {
    let res = [];
    let location = [];
    let contact = [];
    if (userDetails["city"]) location.push(userDetails["city"]);
    if (userDetails["country"]) location.push(userDetails["country"]);
    if (userDetails["country_code"])
      contact.push("+" + userDetails["country_code"]);
    if (userDetails["phone"]) contact.push(userDetails["phone"]);

    if (location.length)
      res.push({
        displayName: "Location",
        icon: <FaMapMarkerAlt className="text-[#f59e42] text-2xl mb-2" />,
        name: location.join(", "),
      });
    if (contact.length)
      res.push({
        displayName: "Contact",
        icon: <FaPhoneAlt className="text-[#0ea5e9] text-2xl mb-2" />,
        name: contact.join(" "),
      });
    return res;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 py-8 font-[Quicksand]">
      <div className=" relative w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-12 flex flex-col items-center">
        <div className="absolute right-4 top-2">
          <Link to="/edit-profile">
            <button
              type="button"
              className="p-2 rounded-full border border-dashed"
            >
              <FaUserEdit className="text-white font-bold text-xl " />
            </button>
          </Link>
        </div>
        <div className="relative flex flex-col items-center">
          {state.user_image ? (
            hasImageError ? (
              <div
                style={{
                  backgroundColor: cacheUserColor[state.user_id]
                    ? cacheUserColor[state.user_id]
                    : "black",
                }}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#0ea5e9] object-cover shadow-lg flex justify-center items-center text-white font-extrabold text-xl md:text-5xl"
              >
                {state.first_name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={
                  state.user_image
                    ? state.user_image
                    : "https://api.dicebear.com/7.x/miniavs/svg?seed=JordanSmith"
                }
                alt="Profile"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#0ea5e9] object-cover shadow-lg bg-white/20"
                onError={() => setHasImageError(true)}
              />
            )
          ) : (
            <div
              style={{
                backgroundColor: cacheUserColor[state.user_id]
                  ? cacheUserColor[state.user_id]
                  : "black",
              }}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#0ea5e9] object-cover shadow-lg  flex justify-center items-center text-white font-extrabold text-xl md:text-5xl"
            >
              {state.first_name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white text-center">
          {state.first_name}
        </h2>
        <div className="text-lg md:text-xl text-[#0ea5e9] font-semibold text-center mt-1 flex flex-col items-center">
          {state.profession && <span>• {state.profession} •</span>}
          <a
            href={`mailto:${state.user_email}`}
            className="flex items-center gap-2 text-[#f59e42] hover:underline mt-1 text-base"
          >
            <FaEnvelope /> {state.user_email}
          </a>
        </div>
        {state.bio && (
          <p className="mt-4 text-white/90 text-base md:text-lg text-center max-w-2xl">
            {state.bio}
          </p>
        )}
        {calculateUserGeneralInfoGridDimension().length >= 1 && (
          <div
            className={`mt-8 grid grid-cols-1 md:grid-cols-${
              calculateUserGeneralInfoGridDimension().length
            } gap-4 w-full`}
          >
            {calculateUserGeneralInfoGridDimension().map((c) => (
              <div
                key={c.displayName}
                className="flex flex-col items-center bg-gradient-to-br from-[#0ea5e9]/30 to-[#3b0764]/30 rounded-xl p-4 shadow"
              >
                {c.icon}
                <span className="text-white font-semibold">{c.name}</span>
                <span className="text-xs text-gray-300 mt-1">
                  {c.displayName}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-5 gap-4 mt-8 mb-2 justify-center">
          {USER_SOCIALS.map(
            (social) =>
              userDetails[social.name] && {
                ...social,
                link: userDetails[social.name],
              }
          )
            .filter((social) => social != null)
            .map((s) => (
              <a
                key={s.name}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className={s.style}
              >
                {s.icon}
              </a>
            ))}
        </div>
        <div className="flex justify-center w-full py-1">
          <button
            onClick={handleUserLogout}
            className="w-full py-2 px-3 bg-red-500 hover:bg-red-600 font-[Quicksand] text-white font-bold text-2xl rounded-md"
          >
            logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
