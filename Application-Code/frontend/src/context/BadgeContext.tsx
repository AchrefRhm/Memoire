// context/BadgeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface Badge {
  _id: string;
  name: string;
  description: string;
  dateReceived: string;
}

interface BadgeContextProps {
  badges: Badge[];
  fetchBadges: () => void;
}

const BadgeContext = createContext<BadgeContextProps | undefined>(undefined);

export const BadgeProvider: React.FC = ({ children }) => {
  const [badges, setBadges] = useState<Badge[] | null>(null);

  const { user } = useAuth();

  const fetchBadges = async () => {
    try {
      const response = await axios.post<{ badges: Badge[] }>(
        `/api/challenges/badges`,
        {
          job: user?.job,
        },
      );

      setBadges(response.data.badge);
    } catch (err) {
      console.error("Error fetching badges:", err);
    }
  };

  useEffect(() => {
    fetchBadges(); // Fetch badges whenever the user is available
  }, [user]);

  return (
    <BadgeContext.Provider value={{ badges, fetchBadges }}>
      {children}
    </BadgeContext.Provider>
  );
};

// Hook to use the Badge context
export const useBadge = (): BadgeContextProps => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error("useBadge must be used within a BadgeProvider");
  }
  return context;
};
