import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#18181b] via-[#232526] to-[#0f2027] px-4 font-[Quicksand] overflow-hidden text-white font-bold">
      <div>Page not found :(</div>
      <Link to="/">
        <button className="flex items-center gap-3 bg-gradient-to-r from-[#3b0764] via-[#0ea5e9] to-[#f59e42] hover:from-[#0ea5e9] hover:to-[#3b0764] text-white font-bold px-3 py-2 md:px-8 md:py-2 rounded-full shadow-xl hover:scale-105  transition-all duration-300 active:scale-95 font-[Quicksand] text-sm md:text-lg uppercase tracking-wider mx-2 my-1">
          Go Back
        </button> 
      </Link>
    </div>
  );
};

export default Error;
