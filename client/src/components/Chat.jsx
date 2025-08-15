import { useState } from "react";
import { createPortal } from "react-dom";
import ChatDisplay from "./ChatDisplay";

const Chat = ({ chats, socketRef, roomId, setChats }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <div
        className="w-[400px] h-[60px] bg-[#313131] text-white font-bold rounded-t-[20px] cursor-pointer hover:bg-black"
        onClick={() => setOpenModal(true)}
      >
        <div className="flex justify-center items-center py-1">
          <p className="px-2">Messages</p>
          <p className="text-[12px] text-red-400 flex justify-center items-center">
            {chats.length}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-[10px] text-gray-400">user near 1 km</p>
        </div>
      </div>
      {openModal &&
        createPortal(
          <div
            className="fixed w-full min-h-screen bg-gray-800/35 top-0 left-0 flex justify-center items-center z-10"
            onClick={() => setOpenModal(false)}
          >
            <ChatDisplay
              chats={chats}
              socketRef={socketRef}
              roomId={roomId}
              setChats={setChats}
            />
          </div>,
          document.getElementById("modal")
        )}
    </>
  );
};

export default Chat;
