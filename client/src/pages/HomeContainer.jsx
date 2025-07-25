import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomeContainer = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-[275px] md:py-52">
      <h1 className="bg-gradient-to-r from-[#f59e42] via-[#0ea5e9] to-[#3b0764] bg-clip-text text-transparent text-5xl md:text-6xl font-extrabold text-center drop-shadow-lg mb-3 font-[Quicksand]">
        PING AROUND
      </h1>
      <p className="text-white text-lg md:text-xl text-center mb-8 font-semibold opacity-90 font-[Quicksand] tracking-wide">
        find your connections
      </p>
      <div className="md:flex p-1">
        <div className="flex justify-center">
          <Link to="neighbourhood">
            <button className="flex items-center gap-3 bg-gradient-to-r from-[#3b0764] via-[#0ea5e9] to-[#f59e42] text-white font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 hover:from-[#0ea5e9] hover:to-[#3b0764] transition-all duration-300 active:scale-95 font-[Quicksand] text-sm md:text-lg uppercase tracking-wider mx-2 my-1">
              <FaUsers className="text-white text-xl" />
              See Others
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
