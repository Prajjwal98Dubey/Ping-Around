import { FaQuestion } from "react-icons/fa";

const Info = () => {
  return (
    <div className="absolute bottom-6 left-6 z-10 px-2 py-2 rounded-full border border-gray-400 hover:scale-110 transition-transform">
      <FaQuestion className="text-[#0ea5e9] text-2xl md:text-2xl drop-shadow-xl " />
    </div>
  );
};

export default Info;
