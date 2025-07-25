import { use, useState } from "react";
import {
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaGlobe,
  FaPhoneAlt,
  FaRegEdit,
  FaSave,
  FaTimes,
  FaAlignLeft,
  FaLinkedin,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaReddit,
  FaTwitter,
  FaCheckCircle,
} from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { UserContext } from "../context/all.context.js";
import {
  compareUserDetails,
  randomColorGenerator,
} from "../helpers/user.helper.js";
import { EDIT_USER } from "../apis/auth.api.js";
import toast from "react-hot-toast";
const USER_SOCIALS = [
  {
    name: "user_instagram",
    icon: <FaInstagram className="text-[#0ea5e9] text-2xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
    displayName: "Instagram",
  },
  {
    name: "user_linkedin",
    icon: <FaLinkedin className="text-[#0ea5e9] text-2xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
    displayName: "LinkedIn",
  },
  {
    name: "user_twitter",
    icon: <FaTwitter className="text-[#0ea5e9] text-2xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
    displayName: "Twitter",
  },
  {
    name: "user_facebook",
    icon: <FaFacebook className="text-[#0ea5e9] text-2xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
    displayName: "Facebook",
  },
  {
    name: "user_github",
    icon: <FaGithub className="text-[#0ea5e9] text-2xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
    displayName: "GitHub",
  },
  {
    name: "user_reddit",
    icon: <FaReddit className="text-[#0ea5e9] text-2xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
    displayName: "Reddit",
  },
  {
    name: "user_random_social",
    icon: <FaGlobe className="text-[#0ea5e9] text-2xl" />,
    style: "bg-white/10 hover:bg-[#0ea5e9]/30 p-3 rounded-full transition",
    displayName: "Other Social",
  },
];

const EditProfile = () => {
  const { userDetails, setUserDetails } = use(UserContext);
  const [updateDetails, setUpdateDetails] = useState({
    ...userDetails,
  });
  const [newSocialLink, setNewSocialLink] = useState("");
  const [newSocial, setNewSocial] = useState({ isOpen: false, name: "" });
  const [hasImageError, setHasImageError] = useState(false);

  const handleChange = (e) => {
    setUpdateDetails({
      ...updateDetails,
      [e.target.name]: e.target.value.length ? e.target.value : null,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile({ ...profile, image: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSocialLink = (e) => {
    setNewSocial({
      isOpen: true,
      name: JSON.parse(e.target.value).displayName,
    });
  };

  const addSocialLink = (name) => {
    if (newSocialLink.length == 0) return alert("Enter the link");
    let linkField = USER_SOCIALS.find((s) => s.displayName == name);
    setUpdateDetails({ ...updateDetails, [linkField.name]: newSocialLink });
    setNewSocial({ isOpen: false, name: "" });
  };

  const removeSocialLink = (name) => {
    setUpdateDetails({ ...updateDetails, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // comparing previous and updated user details
    const updatedFields = compareUserDetails(userDetails, updateDetails);
    await fetch(EDIT_USER, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedFields),
    });
    toast.success("Profile Edited ...", {
      duration: 1500,
      position: "top-center",
    });
    setUserDetails({ ...updateDetails });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-2 py-8 font-[Quicksand]">
      <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#f59e42] via-[#0ea5e9] to-[#3b0764] bg-clip-text text-transparent text-center mb-1">
        Edit Profile
      </h1>
      <p className="text-center text-gray-400 mb-6 text-base sm:text-lg">
        Update your information to keep your profile current
      </p>
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(59,7,100,0.10) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-6 max-h-[80vh] overflow-y-auto p-4 sm:p-8"
        >
          <h2 className="text-xl font-bold text-center text-gray-400 mb-2">
            Profile Information
          </h2>
          <div className="flex flex-col items-center">
            <label className="relative cursor-pointer group">
              {updateDetails.user_image ? (
                hasImageError ? (
                  <div
                    style={{ backgroundColor: randomColorGenerator() }}
                    className="flex justify-center items-center text-xl text-white font-extrabold w-24 h-24 rounded-full object-cover"
                  >
                    {updateDetails.first_name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <img
                    src={updateDetails.user_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#0ea5e9] shadow-lg"
                    onError={() => setHasImageError(true)}
                  />
                )
              ) : (
                <div
                  style={{ backgroundColor: randomColorGenerator() }}
                  className="flex justify-center items-center text-xl text-white font-extrabold w-24 h-24 rounded-full object-cover"
                >
                  {updateDetails.first_name.charAt(0).toUpperCase()}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              <span className="absolute bottom-2 right-2 bg-[#0ea5e9] text-white rounded-full p-2 shadow group-hover:bg-[#2563eb] transition">
                <FaRegEdit />
              </span>
            </label>
            <span className="text-xs text-gray-400 mt-2">
              Click on the image to change your profile picture
            </span>
          </div>
          <div>
            <label className="flex items-center gap-2 text-[#6366f1] font-semibold mb-1 text-sm">
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              name="first_name"
              value={updateDetails.first_name}
              onChange={handleChange}
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(59,7,100,0.10) 100%)",
              }}
              className="w-full text-white border border-[#0ea5e9] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition "
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[#0ea5e9] font-semibold mb-1 text-sm">
              <FaBriefcase /> Profession
            </label>
            <input
              type="text"
              name="profession"
              value={updateDetails.profession ? updateDetails.profession : ""}
              onChange={handleChange}
              className="w-full border border-[#0ea5e9] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition text-white"
              placeholder="Profession"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(59,7,100,0.10) 100%)",
              }}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[#22c55e] font-semibold mb-1 text-sm">
              <FaAlignLeft /> Bio
            </label>
            <textarea
              name="bio"
              value={updateDetails.bio ? updateDetails.bio : ""}
              onChange={handleChange}
              className="w-full border border-[#0ea5e9] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition text-white"
              placeholder="Bio"
              rows={3}
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(59,7,100,0.10) 100%)",
              }}
            />
          </div>
          {/* Contact Number */}
          <div>
            <label className="flex items-center gap-2 text-[#f59e42] font-semibold mb-1 text-sm">
              <FaPhoneAlt /> Contact Number
            </label>
            <input
              type="text"
              name="phone"
              value={updateDetails.phone ? updateDetails.phone : ""}
              onChange={handleChange}
              className="w-full border border-[#0ea5e9] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition text-white "
              placeholder="Contact Number"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(59,7,100,0.10) 100%)",
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-[#f43f5e] font-semibold mb-1 text-sm">
                <FaMapMarkerAlt /> City
              </label>
              <input
                type="text"
                name="city"
                value={updateDetails.city ? updateDetails.city : ""}
                onChange={handleChange}
                className="w-full border border-[#0ea5e9] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition text-white"
                placeholder="City"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(59,7,100,0.10) 100%)",
                }}
              />
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-[#6366f1] font-semibold mb-1 text-sm">
                <FaGlobe /> Country
              </label>
              <input
                type="text"
                name="country"
                value={updateDetails.country ? updateDetails.country : ""}
                onChange={handleChange}
                className="w-full border border-[#0ea5e9] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f59e42] transition text-white"
                placeholder="Country"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(59,7,100,0.10) 100%)",
                }}
              />
            </div>
          </div>
          {/* Socials */}
          <div>
            <label className="flex items-center gap-2 text-[#f59e42] font-semibold mb-1 text-sm">
              <FaGlobe /> Socials
            </label>
            <div className="flex my-1">
              {USER_SOCIALS.filter(
                (social) => updateDetails[social.name] != null
              ).map((socail) => (
                <div className="p-2 m-1 relative" key={socail.name}>
                  <div>{socail.icon}</div>
                  <div
                    className="absolute top-0 right-[-2px]"
                    onClick={() => removeSocialLink(socail.name)}
                  >
                    <IoIosCloseCircle className="text-red-600" />
                  </div>
                </div>
              ))}
            </div>
            <select
              defaultValue="no-select"
              onChange={handleSocialLink}
              className="w-full rounded-md py-2 px-2"
              name=""
              id=""
            >
              <option value="no-select">select a option</option>
              {USER_SOCIALS.filter((s) => updateDetails[s.name] == null).map(
                (social) => (
                  <option
                    value={JSON.stringify(social)}
                    className=""
                    key={social.displayName}
                  >
                    {social.displayName}
                  </option>
                )
              )}
            </select>
            {newSocial.isOpen && (
              <div className="w-full flex py-3 justify-center">
                <div>
                  <input
                    type="text"
                    placeholder={`add ${newSocial.name} link`}
                    value={newSocialLink}
                    onChange={(e) => setNewSocialLink(e.target.value)}
                    className="w-full rounded-md py-1 px-1 font-medium text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(59,7,100,0.10) 100%)",
                    }}
                  />
                </div>
                <div
                  className="flex justify-center items-center px-1"
                  onClick={() => addSocialLink(newSocial.name)}
                >
                  <FaCheckCircle className="text-xl text-green-500 font-semibold" />
                </div>
                <div
                  className="flex justify-center items-center px-1"
                  onClick={() => {
                    setNewSocial({ isOpen: false, name: "" });
                  }}
                >
                  <IoIosCloseCircle className="text-2xl text-red-700 font-semibold" />
                </div>
              </div>
            )}
            {/* <input
              type="text"
              name="phone"
              value={updateDetails.phone}
              onChange={handleChange}
              className="w-full border border-[#f59e42] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition text-gray-800"
              placeholder="Contact Number"
            /> */}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#3b0764] via-[#0ea5e9] to-[#f59e42] text-white font-bold px-6 py-2 rounded-md shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 text-base"
            >
              <FaSave /> Save Changes
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-[#0ea5e9] text-[#0ea5e9] font-bold px-6 py-2 rounded-md shadow hover:bg-[#0ea5e9]/10 transition-all duration-300 text-base"
              onClick={() => window.history.back()}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
