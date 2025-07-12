import { FaLocationArrow } from "react-icons/fa";

const HomeContainer = () => {
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center py-10 px-6">
      <h1 className="bg-gradient-to-r from-[#f59e42] via-[#0ea5e9] to-[#3b0764] bg-clip-text text-transparent text-5xl md:text-6xl font-extrabold text-center drop-shadow-lg mb-3 tracking-widest font-[Quicksand]">
        Ping Around
      </h1>
      <p className="text-white text-lg md:text-xl text-center mb-8 font-semibold opacity-90 font-[Quicksand] tracking-wide">
        find your connections
      </p>
      <button className="flex items-center gap-3 bg-gradient-to-r from-[#3b0764] via-[#0ea5e9] to-[#f59e42] text-white font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 hover:from-[#0ea5e9] hover:to-[#3b0764] transition-all duration-300 active:scale-95 font-[Quicksand] text-lg uppercase tracking-wider">
        <FaLocationArrow className="text-white text-xl" />
        share your location
      </button>
    </div>
  );
};

export default HomeContainer;
