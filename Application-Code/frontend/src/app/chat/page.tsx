"use client";
import PremiumFeatureModal from "@/components/PremiumFeatureModal";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const ChatArea = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const job = user?.job;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);
  const socket = useSocket();
  const router = useRouter();
  useEffect(() => {
    if (!socket) return;
    socket.emit("joinRoom", job);
    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
    });
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.disconnect();
    };
  }, [userId, job]);

  const handleSendMessage = () => {
    if (!message.trim() || !socket) return;

    const newMessage = {
      userId,
      text: message,

      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", newMessage, job);
    setMessage(""); // Only clear input, don't update messages state
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit("typing", job);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop typing", job);
    }, 2000);
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user?.subs !== "ultimate") {
      setShowPremiumModal(true);
    }
  }, [user]);
  const handleCloseModal = () => {
    setShowPremiumModal(false);
    router.push("/"); // Redirect to home page when modal is closed
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-violet-100 via-rose-50 to-amber-50">
      <PremiumFeatureModal
        isOpen={showPremiumModal}
        onClose={() => handleCloseModal()}
        featureName="Ultimate feature "
        featureDescription="Upgrade to ultimate to unlock chat feature."
        ctaText="Upgrade to Ultimate"
        planType="ultimate"
      />

      {/* Elevated Header with Glass Morphism */}
      <div className="relative mb-2 rounded-b-3xl bg-white/80 p-5 shadow-lg backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-[2px]">
                <div className="h-full w-full rounded-full bg-white p-[2px]">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-500 to-pink-600"></div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-gray-800">
                {user?.job}s
              </h2>
              <p className="text-xs font-medium text-emerald-500">Online now</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full bg-gray-100 p-2 text-gray-600 transition-all hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
              </svg>
            </button>
            <button className="rounded-full bg-gray-100 p-2 text-gray-600 transition-all hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area with Improved Styling */}
      <div className="flex flex-1 flex-col space-y-6 overflow-y-auto p-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 ${msg.userId === userId ? "flex-row-reverse" : ""}`}
          >
            {msg.userId !== userId && (
              <div className="relative h-12 w-12 flex-shrink-0">
                {user?.subs === "ultimate" ? (
                  <>
                    <div className="h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 p-[2px]">
                      <img
                        src={
                          msg?.senderAvatar?.startsWith("https")
                            ? msg.senderAvatar
                            : `http://localhost:5000${msg.senderAvatar}`
                        }
                        alt="Avatar"
                        className="h-full w-full rounded-2xl border-2 border-white object-cover"
                      />
                    </div>
                    <span className="mb-1 ml-1 block text-xs font-semibold text-gray-600">
                      {msg.senderName || "User"}
                    </span>
                  </>
                ) : (
                  <div className="h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 p-[1px] opacity-70">
                    <div className="absolute inset-0 overflow-hidden rounded-2xl backdrop-blur-md">
                      <img
                        src={
                          msg?.senderAvatar.startsWith("https")
                            ? msg.senderAvatar
                            : `http://localhost:5000${msg.senderAvatar}`
                        }
                        alt="Blurred Avatar"
                        className="h-full w-full scale-110 blur-xl brightness-90"
                      />
                    </div>
                    <div className="absolute inset-[3px] flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              className={`max-w-xs ${msg.userId === userId ? "items-end" : "items-start"}`}
            >
              <div
                className={`rounded-3xl p-4 shadow-lg ${
                  msg.userId === userId
                    ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white"
                    : "bg-white text-gray-800"
                } ${user?.subs !== "ultimate" ? "border border-white/20 bg-opacity-90 backdrop-blur-md" : ""}`}
              >
                <p
                  className={`text-sm leading-relaxed ${
                    user?.subs !== "ultimate" ? "select-none blur-[0.5px]" : ""
                  }`}
                >
                  {user?.subs !== "ultimate"
                    ? "Upgrade to view this message"
                    : msg.text}
                </p>
              </div>

              <span
                className={`mt-2 block text-xs font-medium ${
                  msg.userId === userId
                    ? "mr-2 text-right text-gray-500"
                    : "ml-2 text-gray-400"
                } ${user?.subs !== "ultimate" ? "blur-[0.3px]" : ""}`}
              >
                {msg.timestamp.slice(0, 10)} • {msg.timestamp.slice(12, 19)}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex max-w-fit items-center gap-3 rounded-full bg-white p-3 pl-5 pr-6 shadow-lg">
            <div className="flex space-x-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400 delay-0"></span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500 delay-300"></span>
              <span className="delay-600 h-2 w-2 animate-pulse rounded-full bg-indigo-600"></span>
            </div>
            <span className="text-sm font-medium text-gray-600">
              Someone is typing
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input Bar with Floating Design */}
      <div className="sticky bottom-0 px-4 pb-4 pt-2">
        <div className="flex items-center gap-2 overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
          <button className="rounded-xl bg-gray-100 p-3 text-gray-500 transition-all hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="flex flex-1 items-center rounded-xl bg-gray-100 px-4 py-2">
            <input
              type="text"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-700 p-3 text-white shadow-md transition-all hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
