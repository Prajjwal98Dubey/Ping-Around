import { useState } from "react";

const ChatDisplay = ({ chats, socketRef, roomId, setChats }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    socketRef.current.emit("post_room_message", { roomId, message });
    setChats((prev) => [...prev, { message, me: true }]);
    setMessage("");
  };

  return (
    <div
      className="w-[400px] lg:w-[700px] h-[600px] z-50 rounded-md font-[Quicksand]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full h-[90%]  bg-[#313131] my-2 rounded-md overflow-auto">
        {chats.map((chat, index) => {
          return chat.me ? (
            <div
              key={index}
              className="flex justify-end px-2 py-2 my-2 text-green-400 font-bold text-lg"
            >
              {chat.message}
            </div>
          ) : (
            <div
              key={index}
              className="flex justify-start px-2 py-2 my-2 text-gray-400 font-bold text-lg"
            >
              {chat.message}
            </div>
          );
        })}
      </div>
      <div className="w-full h-[10%] relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-full bg-[#313131] rounded-md text-white font-bold text-xl px-2 py-1 "
        ></input>
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
