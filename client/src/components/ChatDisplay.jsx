import { use, useEffect, useRef, useState } from "react";
import { CacheColorContext, UserContext } from "../context/all.context";

const ChatDisplay = ({ chats, socketRef, roomId, setChats }) => {
  const [message, setMessage] = useState("");
  const { userDetails } = use(UserContext);
  const { cacheUserColor } = use(CacheColorContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    const setScrollHeight = () => {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    };
    setScrollHeight();
  }, [chats]);
  useEffect(() => {
    const textarea = document.getElementById("inp_container");
    let initialHeight = textarea.style.height;
    textarea.addEventListener("input", () => {
      textarea.style.height = initialHeight;
      textarea.style.height = textarea.scrollHeight + "px";
    });
  }, []);

  const handleSendMessage = () => {
    socketRef.current.emit("post_room_message", {
      roomId,
      message,
      userImage: userDetails.user_image,
      userName: userDetails.first_name,
      userId: userDetails.user_id,
    });
    setChats((prev) => [
      ...prev,
      {
        userImage: userDetails.user_image,
        userName: userDetails.first_name,
        message,
        me: true,
      },
    ]);
    setMessage("");
  };

  return (
    <div
      className="w-[400px] lg:w-[700px] h-[600px] z-50 rounded-md font-[Quicksand]"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={scrollRef}
        className="w-full h-[90%]  bg-[#313131] my-2 rounded-md overflow-auto"
      >
        {chats.map((chat, index) => {
          return chat.me ? (
            <div key={index} className="w-full flex px-1 justify-end my-1">
              <div className="px-2 bg-green-500 font-bold w-fit h-fit rounded-md">
                <p className=" text-white text-[13px] font-bold my-[2px]">
                  {chat.message}
                </p>
              </div>
            </div>
          ) : (
            <div key={index} className="w-full flex px-1 justify-start my-1">
              <div className="px-1 flex justify-center items-center">
                {chat.userImage ? (
                  <img
                    src={chat.userImage}
                    alt="loading"
                    className="w-[20px] h-[20px] rounded-full"
                  />
                ) : (
                  <div
                    style={{
                      backgroundColor: cacheUserColor[chat.userId],
                    }}
                    className={`w-[20px] h-[20px] 
                    rounded-full flex justify-center items-center text-white font-bold`}
                  >
                    {chat.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="px-2 bg-amber-500 font-bold w-fit h-fit rounded-md">
                <div className="flex justify-start">
                  <p className="text-purple-700 text-[11px] font-semibold">
                    {chat.userName}
                  </p>
                </div>
                <div>
                  <p className=" text-white text-[13px] font-bold mb-[3px]">
                    {chat.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full h-[10%] relative">
        <textarea
          id="inp_container"
          value={message}
          rows="1"
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-full bg-[#313131] rounded-md text-white font-bold text-xl px-2 py-1"
        ></textarea>
        <button
          onClick={handleSendMessage}
          className="absolute right-0 top-0 bg-blue-500 h-full w-[130px] rounded-md text-xl font-bold text-white"
        >
          send
        </button>
      </div>
    </div>
  );
};

export default ChatDisplay;
