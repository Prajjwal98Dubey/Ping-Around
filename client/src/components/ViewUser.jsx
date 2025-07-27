import { lazy, use, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaReddit,
  FaTwitter,
} from "react-icons/fa";
import { CacheColorContext } from "../context/all.context.js";

const SOCIALS_LIST = [
  "user_instagram",
  "user_twitter",
  "user_linkedin",
  "user_github",
  "user_reddit",
  "user_facebook",
  "user_random_social",
];
const USER_SOCIALS = [
  {
    name: "user_instagram",
    icon: <FaInstagram className="text-[#E1306C] text-lg md:text-xl" />, // Instagram pink
    style: "bg-white/10 hover:bg-[#E1306C]/30 p-3 rounded-full transition",
    displayName: "Instagram",
  },
  {
    name: "user_linkedin",
    icon: <FaLinkedin className="text-[#0077B5] text-lg md:text-xl" />, // LinkedIn blue
    style: "bg-white/10 hover:bg-[#0077B5]/30 p-3 rounded-full transition",
    displayName: "LinkedIn",
  },
  {
    name: "user_twitter",
    icon: <FaTwitter className="text-[#1DA1F2] text-lg md:text-xl" />, // Twitter blue
    style: "bg-white/10 hover:bg-[#1DA1F2]/30 p-3 rounded-full transition",
    displayName: "Twitter",
  },
  {
    name: "user_facebook",
    icon: <FaFacebook className="text-[#1877F2] text-lg md:text-xl" />, // Facebook blue
    style: "bg-white/10 hover:bg-[#1877F2]/30 p-3 rounded-full transition",
    displayName: "Facebook",
  },
  {
    name: "user_github",
    icon: <FaGithub className="text-[#333] text-lg md:text-xl" />, // GitHub black
    style: "bg-white/10 hover:bg-[#333]/30 p-3 rounded-full transition",
    displayName: "GitHub",
  },
  {
    name: "user_reddit",
    icon: <FaReddit className="text-[#FF4500] text-lg md:text-xl" />, // Reddit orange
    style: "bg-white/10 hover:bg-[#FF4500]/30 p-3 rounded-full transition",
    displayName: "Reddit",
  },
  {
    name: "user_random_social",
    icon: <FaGlobe className="text-[#0ea5e9] text-lg md:text-xl" />, // fallback blue for 'Other'
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
    displayName: "Other Social",
  },
];

const DetailViewUser = lazy(() => import("./DetailViewUser.jsx"));

const ViewUser = ({ details, handleMouseLeave }) => {
  const [openDetailView, setOpenDetailView] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const { cacheUserColor } = use(CacheColorContext);
  return (
    <div className="w-[260px] md:w-[320px] rounded-2xl bg-[#313131] text-white z-10 shadow-xl shadow-[#0ea5e9]/20 font-[Quicksand] border border-[#0ea5e9]/20 p-4 relative overflow-hidden">
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#0ea5e9]/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {details.user_image ? (
            hasImageError ? (
              <div
                style={{
                  backgroundColor: cacheUserColor[details.user_id]
                    ? cacheUserColor[details.user_id]
                    : "black",
                }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#0ea5e9] shadow flex justify-center items-center font-extrabold text-white"
              >
                {details.first_name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <img
                src={details.user_image}
                alt="user_image"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#0ea5e9] shadow"
                onError={() => setHasImageError(true)}
              />
            )
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#232526] flex justify-center items-center font-bold text-2xl border-2 border-[#0ea5e9] shadow">
              {details.first_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-extrabold text-lg md:text-xl tracking-wide text-[#f59e42] ">
            {details.first_name}
          </span>
          {details.profession && (
            <span className="text-[#f59e42] text-xs md:text-sm font-semibold mt-1">
              {details.profession}
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-5">
        {SOCIALS_LIST.filter((social) => details[social] != null).length ? (
          <div className="flex">
            {SOCIALS_LIST.filter((s) => details[s] != null).map((social) => (
              <a
                href={
                  "https://" +
                  `${details[social].substring(details[social].indexOf("www"))}`
                }
                target="_blank"
                key={social}
              >
                <div className="p-1 cursor-pointer">
                  {USER_SOCIALS.filter((u) => u.name == social)[0].icon}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-gray-300 font-medium text-xs md:text-sm">
            no socials
          </div>
        )}
        <button
          onClick={() => setOpenDetailView(true)}
          type="button"
          className="bg-gradient-to-r from-[#3b0764] via-[#0ea5e9] to-[#f59e42] px-4 py-2 font-bold rounded-full shadow-lg hover:scale-105 hover:from-[#0ea5e9] hover:to-[#3b0764] transition-all duration-300 text-xs md:text-base"
        >
          More Details
        </button>
        {openDetailView &&
          createPortal(
            <>
              <div
                onClick={() => {
                  setOpenDetailView(false);
                  handleMouseLeave(details.user_id);
                }}
                className="fixed top-0 w-full min-h-screen bg-gray-400/40 flex justify-center items-center"
              ></div>
              <DetailViewUser userId={details.user_id} />
            </>,
            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default ViewUser;
