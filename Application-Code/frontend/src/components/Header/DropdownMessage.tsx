import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

const DropdownMessage = () => {
  const [notifying, setNotifying] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState(false);
  const { user } = useAuth();
  const userId = user?._id;
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.on("newMessageNotification", (message) => {
      console.log(message);
      setMessages((prev) => [...prev, message]);
      setNotifying(true);
    });

    return () => {
      socket.off("newMessageNotification");
    };
  }, [userId, messages]);
  const handleChatClick = (e) => {
    e.preventDefault();
    if (user?.subs !== "ultimate") {
      setShowUpgradeTooltip(!showUpgradeTooltip);
      // Don't open modal here, we'll show tooltip instead
      return;
    }
    setNotifying(false);
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="relative">
        <Link
          onClick={handleChatClick}
          className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white ${
            user?.subs === "ultimate" ? "cursor-not-allowed" : ""
          }`}
          href="#"
        >
          <span
            className={`absolute -right-0.5 -top-0.5 z-1 h-2 w-2 rounded-full bg-meta-1 ${
              notifying === false ? "hidden" : "inline"
            }`}
          >
            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
          </span>

          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.9688 1.57495H7.03135C3.43135 1.57495 0.506348 4.41558 0.506348 7.90308C0.506348 11.3906 2.75635 13.8375 8.26885 16.3125C8.40947 16.3687 8.52197 16.3968 8.6626 16.3968C8.85947 16.3968 9.02822 16.3406 9.19697 16.2281C9.47822 16.0593 9.64697 15.75 9.64697 15.4125V14.2031H10.9688C14.5688 14.2031 17.522 11.3625 17.522 7.87495C17.522 4.38745 14.5688 1.57495 10.9688 1.57495ZM10.9688 12.9937H9.3376C8.80322 12.9937 8.35322 13.4437 8.35322 13.9781V15.0187C3.6001 12.825 1.74385 10.8 1.74385 7.9312C1.74385 5.14683 4.10635 2.8687 7.03135 2.8687H10.9688C13.8657 2.8687 16.2563 5.14683 16.2563 7.9312C16.2563 10.7156 13.8657 12.9937 10.9688 12.9937Z"
              fill="currentColor" // Fixed empty fill
            />
            <path
              d="M5.42812 7.28442C5.0625 7.28442 4.78125 7.56567 4.78125 7.9313C4.78125 8.29692 5.0625 8.57817 5.42812 8.57817C5.79375 8.57817 6.075 8.29692 6.075 7.9313C6.075 7.56567 5.79375 7.28442 5.42812 7.28442Z"
              fill="currentColor" // Fixed empty fill
            />
            <path
              d="M9.00015 7.28442C8.63452 7.28442 8.35327 7.56567 8.35327 7.9313C8.35327 8.29692 8.63452 8.57817 9.00015 8.57817C9.33765 8.57817 9.64702 8.29692 9.64702 7.9313C9.64702 7.56567 9.33765 7.28442 9.00015 7.28442Z"
              fill="currentColor" // Fixed empty fill
            />
            <path
              d="M12.5719 7.28442C12.2063 7.28442 11.925 7.56567 11.925 7.9313C11.925 8.29692 12.2063 8.57817 12.5719 8.57817C12.9375 8.57817 13.2188 8.29692 13.2188 7.9313C13.2188 7.56567 12.9094 7.28442 12.5719 7.28442Z"
              fill="currentColor" // Fixed empty fill
            />
          </svg>
        </Link>
        {/* Upgrade tooltip */}
        {user?.subs !== "ultimate" && showUpgradeTooltip && (
          <div className="absolute left-1/2 top-10 z-10 -translate-x-1/2 transform rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white shadow-xl transition-all duration-300 ease-in-out">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.414 5a1 1 0 01-1.414 1.414L13 5.414l-1 1a1 1 0 01-1.414-1.414l1-1 .707-.707A1 1 0 0112 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Upgrade to Ultimate</span>
            </div>
            <p className="mt-1 text-sm opacity-90">
              Unlock unlimited message access
            </p>
            <div className="mt-2 text-center">
              <button className="rounded bg-white px-3 py-1 text-sm font-medium text-indigo-600 transition-colors hover:bg-opacity-90">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {dropdownOpen && (
          <div
            className={`absolute -right-16 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
          >
            <div className="px-4.5 py-3">
              <h5 className="  text-sm font-medium text-bodydark2">Messages</h5>
            </div>
            {messages.length === 0 ? (
              <p className="text-center">No new messages</p>
            ) : (
              messages.map((msg, index) => (
                <Link
                  key={index}
                  href={"/chat"}
                  className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                >
                  <div className="h-12.5 w-12.5 rounded-full">
                    <Image
                      width={112}
                      height={112}
                      src={msg.img}
                      alt={`Message from ${msg.user}`} // Updated alt text
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="text-sm font-semibold text-black dark:text-white">
                      Group: {user.job}s
                    </h6>
                    <h6 className="text-sm font-normal text-black dark:text-white">
                      sender: {msg.user}
                    </h6>
                    <p className="text-sm">{msg.message.text}</p>
                    <p className="text-xs">{msg.message.timestamp}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownMessage;
