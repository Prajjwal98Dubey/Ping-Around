import { use, useEffect, useRef, useState } from "react";
import { CacheColorContext, UserContext } from "../context/all.context";
import { FaCamera } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";

import { HANDLE_USER_IMAGE_UPLOAD } from "../apis/auth.api";

const ChatDisplay = ({ chats, socketRef, roomId, setChats }) => {
  const [message, setMessage] = useState("");
  const { userDetails } = use(UserContext);
  const { cacheUserColor } = use(CacheColorContext);
  const scrollRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileDetails, setFileDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState("");
  const [isImageZoom, setIsImageZoom] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState("");
  const [isImageSelect, setIsImageSelect] = useState(false);
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

  const handleSendMessage = async () => {
    let imageUrl = "";
    if (fileName) {
      setIsLoading(true);
      let res = await fetch(HANDLE_USER_IMAGE_UPLOAD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, fileType }),
        credentials: "include",
      });
      res = await res.json();
      await fetch(res.signedUrl, {
        method: "PUT",
        headers: {
          "Content-type": fileType,
        },
        body: fileDetails,
      });
      imageUrl = res.publicUrl;
      setIsImageSelect(false);
      setIsLoading(false);
    }
    socketRef.current.emit("post_room_message", {
      roomId,
      message,
      userImage: userDetails.user_image,
      userName: userDetails.first_name,
      userId: userDetails.user_id,
      isImage: imageUrl ? true : false,
      imageUrl,
    });
    setChats((prev) => [
      ...prev,
      {
        userImage: userDetails.user_image,
        userName: userDetails.first_name,
        message,
        me: true,
        isImage: imageUrl ? true : false,
        imageUrl,
      },
    ]);
    setMessage("");
    setFileName("");
    setFileDetails({});
    setIsImageSelect(false);
    setFileType("");
    setSelectedImage("");
    imageUrl = "";
  };

  return (
    <div
      className="w-[400px] lg:w-[700px] h-[600px] z-50 rounded-md font-[Quicksand]"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={scrollRef}
        className="w-full h-[90%] bg-[#313131] my-2 rounded-md overflow-auto py-2"
      >
        {chats.map((chat, index) => {
          return chat.me ? (
            <div key={index} className="w-full flex px-2 justify-end my-2">
              {chat.isImage ? (
                <div className="px-2 py-2">
                  <img
                    onClick={() => {
                      setZoomImageUrl(chat.imageUrl);
                      setIsImageZoom(true);
                    }}
                    src={chat.imageUrl}
                    alt="photo"
                    className="w-[200px] h-[150px] rounded-md"
                  />
                </div>
              ) : (
                <div className="px-2 bg-green-600 font-bold  max-w-[300px] lg:max-w-[650px] h-fit py-2 rounded-md break-words">
                  <p className=" text-white text-[14px] font-bold my-[2px]">
                    {chat.message}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div key={index} className="w-full flex px-1 justify-start my-2">
              <div className="flex justify-center items-center px-1">
                {chat.userImage ? (
                  <img
                    src={chat.userImage}
                    alt="loading"
                    className="w-[30px] h-[30px] rounded-full"
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
              <div className="px-2 bg-purple-500 font-bold w-fit h-fit rounded-md py-2">
                <div className="flex justify-start">
                  <p className="text-amber-300 text-[11px] font-semibold">
                    {chat.userName}
                  </p>
                </div>
                {chat.isImage ? (
                  <div
                    onClick={() => {
                      setZoomImageUrl(chat.imageUrl);
                      setIsImageZoom(true);
                    }}
                    className=""
                  >
                    <img
                      src={chat.imageUrl}
                      alt="photo"
                      className="w-[200px] h-[150px] rounded-md"
                    />
                  </div>
                ) : (
                  <div className="max-w-[300px] h-fit lg:max-w-[650px] break-words">
                    <p className=" text-white text-[14px] font-bold mb-[3px]">
                      {chat.message}
                    </p>
                  </div>
                )}
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
          className="w-full h-full bg-[#313131] rounded-md text-white font-bold text-[16px] pr-[90px] pl-2 py-1"
        ></textarea>
        <div
          className={`absolute right-0 top-3 h-fit w-fit px-4 rounded-md text-xl font-bold text-white flex`}
        >
          <div className="border border-gray-600 px-2 py-2 rounded-[10px] mx-1 hover:border-gray-400 text-gray-200 text-lg flex justify-center items-center">
            <label>
              <FaCamera className="cursor-pointer" />
              <input
                onChange={(e) => {
                  setFileName(e.target.files[0].name);
                  setFileType(e.target.files[0].type);
                  setFileDetails(e.target.files[0]);
                  setSelectedImage(e.target.files[0]);
                  setIsImageSelect(true);
                }}
                type="file"
                className="sr-only"
                accept="image/*"
              />
            </label>
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={handleSendMessage}
              className="border border-gray-600 px-2 py-2 rounded-[10px] hover:border-gray-400 text-gray-200 text-lg"
            >
              <LuSendHorizontal />
            </button>
          </div>
        </div>
      </div>

      {isImageSelect && (
        <div
          onClick={() => setIsImageSelect(false)}
          className="transition duration-300 fixed top-0 left-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 w-full min-h-screen"
        >
          <div className="transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 fixed">
            <img
              onClick={(e) => e.stopPropagation()}
              src={URL.createObjectURL(fileDetails)}
              alt="image_zoom"
              className="w-[400px] h-[300px] rounded-md z-50 blur-none"
            />
            <div className="flex justify-center items-center my-2">
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 cursor-pointer font-semibold"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
      {isImageZoom && (
        <div
          onClick={() => setIsImageZoom(false)}
          className="transition duration-300 fixed top-0 left-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 w-full min-h-screen"
        >
          <div className="transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 fixed">
            <img
              onClick={(e) => e.stopPropagation()}
              src={zoomImageUrl}
              alt="image_zoom"
              className="w-[400px] h-[300px] rounded-md z-50 blur-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDisplay;
