import { useState, useEffect } from "react";
import Link from "next/link";
import { io } from "socket.io-client";
import ClickOutside from "@/components/ClickOutside";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [challengeNotifications, setChallengeNotifications] = useState<any[]>(
    [],
  );
  const [badgeNotifications, setBadgeNotifications] = useState<any[]>([]);
  const socket = useSocket();
  const { user } = useAuth();
  const userId = user?._id;

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedChallenges = JSON.parse(
      localStorage.getItem("challengeNotifications") || "[]",
    );
    const storedBadges = JSON.parse(
      localStorage.getItem("badgeNotifications") || "[]",
    );

    setChallengeNotifications(storedChallenges);
    setBadgeNotifications(storedBadges);
    setNotifying(storedChallenges.length > 0 || storedBadges.length > 0);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newChallenge", (challenge: any) => {
      console.log(challenge);
      const updatedChallenges = [...challengeNotifications, challenge];
      setChallengeNotifications(updatedChallenges);
      localStorage.setItem(
        "challengeNotifications",
        JSON.stringify(updatedChallenges),
      );
      setNotifying(true);
    });

    socket.on("newBadge", (badge: any) => {
      console.log(badge);

      const updatedBadges = [...badgeNotifications, badge];
      setBadgeNotifications(updatedBadges);
      localStorage.setItem("badgeNotifications", JSON.stringify(updatedBadges));
      setNotifying(true);
    });

    return () => {
      socket.off("newChallenge");
      socket.off("newBadge");
    };
  }, [userId, badgeNotifications, challengeNotifications]);

  // Toggle dropdown open/close
  const handleNotificationClick = () => {
    setDropdownOpen(!dropdownOpen);
    // Keep notifications but mark as "seen" by removing the red dot
    setNotifying(false);
  };

  // Remove an individual challenge notification
  const removeChallenge = (challengeId: string) => {
    const filtered = challengeNotifications.filter(
      (notification) => notification._id !== challengeId,
    );
    setChallengeNotifications(filtered);
    localStorage.setItem("challengeNotifications", JSON.stringify(filtered));
    updateNotifyingStatus(filtered, badgeNotifications);
  };

  // Remove an individual badge notification
  const removeBadge = (badgeId: string) => {
    const filtered = badgeNotifications.filter(
      (notification) => notification._id !== badgeId,
    );
    setBadgeNotifications(filtered);
    localStorage.setItem("badgeNotifications", JSON.stringify(filtered));
    updateNotifyingStatus(challengeNotifications, filtered);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setChallengeNotifications([]);
    setBadgeNotifications([]);
    localStorage.removeItem("challengeNotifications");
    localStorage.removeItem("badgeNotifications");
    setNotifying(false);
  };

  // Update the notifying status based on whether there are any notifications
  const updateNotifyingStatus = (challenges: any[], badges: any[]) => {
    setNotifying(challenges.length > 0 || badges.length > 0);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={handleNotificationClick}
          href="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <span
            className={`absolute -top-0.5 right-0 h-2 w-2 rounded-full bg-meta-1 ${
              notifying ? "inline" : "hidden"
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
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343Z"
              fill=""
            />
          </svg>
        </Link>

        {dropdownOpen && (
          <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
            <div className="flex items-center justify-between px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">
                Notifications
              </h5>
              <button
                onClick={clearAllNotifications}
                className="text-xs text-meta-1 hover:underline"
              >
                Clear All
              </button>
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto">
              {challengeNotifications.map((notification) => (
                <li
                  key={notification._id || notification.title}
                  className="relative"
                >
                  <Link
                    className="flex flex-col gap-y-1.5 border-b border-t border-stroke px-4.5 py-3 text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    href="/defit"
                  >
                    <p className="text-sm font-bold">Nouveau Défit uploaded:</p>
                    <p className="text-sm">
                      <span className="font-bold">Titre:</span>{" "}
                      {notification.title}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">Contenu:</span>{" "}
                      {notification.question.slice(0, 70)}...
                    </p>
                    <p className="text-xs">
                      <span className="font-bold">Date D'expiration: </span>{" "}
                      {notification.expiresAt.slice(0, 10)} At{" "}
                      {notification.expiresAt.slice(11, 19)}
                    </p>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChallenge(notification._id);
                    }}
                    className="absolute right-2 top-2 p-1 text-xs text-gray-500 hover:text-meta-1"
                    title="Dismiss notification"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </li>
              ))}

              {badgeNotifications.map((notification) => (
                <li
                  key={notification._id}
                  className="relative flex flex-col gap-y-1.5 border-b border-t border-stroke px-4.5 py-3 text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                >
                  <Link href={`/defit/badge/${notification._id}`}>
                    <p className="text-sm">
                      New badge received: Badge of {notification.type}{" "}
                      {notification.icon}
                    </p>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBadge(notification._id);
                    }}
                    className="absolute right-0 top-2.5  p-1 text-xs text-gray-500 hover:text-meta-1"
                    title="Dismiss notification"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </li>
              ))}

              {!challengeNotifications.length && !badgeNotifications.length && (
                <li className="p-4 text-center text-sm text-gray-500">
                  No new notifications
                </li>
              )}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
