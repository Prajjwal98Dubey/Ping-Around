const Footer = () => {
  return (
    <div className="w-full h-[80px] border border-transparent border-t-gray-400 flex justify-center font-[Quicksand] text-gray-400">
      <div className="flex justify-center items-center">
        <div>
          <div className="p-1 text-[11px] md:text-[13px] flex justify-center items-center font-bold text-white">
            What Ping Around do ?
          </div>
          <div className="text-[13px] md:text-[15px] flex justify-center items-center font-extrabold ">
            Connects you with people in
            <span className="text-green-500 px-1">similar</span>
            or
            <span className="text-[#f59e42] px-1">diverse</span>
            professions
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
