import { use, useEffect, useState } from "react";
import {
  FaEnvelope,
  FaAlignLeft,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaBriefcase,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaGithub,
  FaReddit,
  FaLinkedin,
  FaUserCircle,
} from "react-icons/fa";
import { GET_USER_DETAILS } from "../apis/auth.api";
import { CacheColorContext } from "../context/all.context.js";

const SOCIALS = [
  {
    key: "user_instagram",
    icon: <FaInstagram className="text-[#E1306C]" />,
    label: "Instagram",
  },
  {
    key: "user_twitter",
    icon: <FaTwitter className="text-[#1DA1F2]" />,
    label: "Twitter",
  },
  {
    key: "user_facebook",
    icon: <FaFacebook className="text-[#1877F2]" />,
    label: "Facebook",
  },
  {
    key: "user_github",
    icon: <FaGithub className="text-[#333]" />,
    label: "GitHub",
  },
  {
    key: "user_reddit",
    icon: <FaReddit className="text-[#FF4500]" />,
    label: "Reddit",
  },
  {
    key: "user_linkedin",
    icon: <FaLinkedin className="text-[#0077B5]" />,
    label: "LinkedIn",
  },
  {
    key: "user_random_social",
    icon: <FaGlobe className="text-[#0ea5e9]" />,
    label: "Other",
  },
];

const DetailViewUser = ({ userId }) => {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);
  const { cacheUserColor } = use(CacheColorContext);
  useEffect(() => {
    const getUserDetails = async () => {
      let res = await fetch(GET_USER_DETAILS + `?userId=${userId}`);
      res = await res.json();
      setDetails({ ...res });
      setIsLoading(false);
    };
    getUserDetails();
  }, [userId]);
  if (isLoading)
    return (
      <div className="flex justify-center items-center font-bold text-center">
        Loading ...
      </div>
    );
  return (
    <>
      <div className="fixed font-[Quicksand] transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10 px-2 w-full max-w-xl mx-auto bg-gradient-to-br from-[#18181b] via-[#232526] to-[#3b0764] rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col items-center border border-[#0ea5e9]/20">
        {details.user_image ? (
          hasImageError ? (
            <div
              style={{
                backgroundColor: cacheUserColor[userId]
                  ? cacheUserColor[userId]
                  : "black",
              }}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#0ea5e9] object-cover shadow-lg text-xl md:text-2xl text-white font-extrabold mb-4 flex justify-center items-center"
            >
              {details.first_name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img
              src={details.user_image}
              alt="Profile"
              onError={() => setHasImageError(true)}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#0ea5e9] object-cover shadow-lg bg-white/20 mb-4"
            />
          )
        ) : (
          <div
            style={{ backgroundColor: cacheUserColor[userId]
                  ? cacheUserColor[userId]
                  : "black" }}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#0ea5e9] object-cover shadow-lg  mb-4 text-xl md:text-2xl text-white font-extrabold flex justify-center items-center"
          >
            {details.first_name.charAt(0).toUpperCase()}
          </div>
        )}
        {details.first_name && (
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#f59e42] mb-1 text-center">
            {details.first_name}
          </h2>
        )}
        {details.profession && (
          <div className="flex items-center gap-2 text-[#0ea5e9] font-semibold text-center mb-2">
            <FaBriefcase /> {details.profession}
          </div>
        )}
        {details.user_email && (
          <div className="flex items-center gap-2 text-[#f59e42] mb-1">
            <FaEnvelope /> <span>{details.user_email}</span>
          </div>
        )}
        {details.gender && (
          <div className="flex items-center gap-2 text-[#0ea5e9] mb-1">
            <FaUserCircle /> <span>{details.gender}</span>
          </div>
        )}
        {details.phone && (
          <div className="flex items-center gap-2 text-[#0ea5e9] mb-1">
            <FaPhoneAlt /> <span>{details.phone}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-4 justify-center mb-2">
          {details.city && (
            <div className="flex items-center gap-2 text-[#0ea5e9]">
              <FaMapMarkerAlt /> <span>{details.city}</span>
            </div>
          )}
          {details.country && (
            <div className="flex items-center gap-2 text-[#0ea5e9]">
              <FaGlobe /> <span>{details.country}</span>
            </div>
          )}
          {details.country_code && (
            <div className="flex items-center gap-2 text-[#0ea5e9]">
              <span className="font-bold">Code:</span>{" "}
              <span>{details.country_code}</span>
            </div>
          )}
        </div>
        {details.bio && (
          <div className="flex items-center gap-2 text-white/90 bg-white/10 rounded-lg px-4 py-2 mb-3 text-center">
            <FaAlignLeft className="text-[#0ea5e9]" />{" "}
            <span>{details.bio}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {SOCIALS.map(
            (s) =>
              details[s.key] && (
                <a
                  key={s.key}
                  href={
                    "https://" +
                    `${details[s.key].substring(details[s.key].indexOf("www"))}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-[#0ea5e9]/20 px-4 py-2 rounded-full transition text-sm font-semibold"
                >
                  {s.icon}
                  <span className="hidden sm:inline text-gray-400">
                    {s.label}
                  </span>
                </a>
              )
          )}
        </div>
      </div>
    </>
  );
};

export default DetailViewUser;
