// context/ChallengeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface Challenge {
  title: string;
  question: string;
}

interface ChallengeContextProps {
  challenge: Challenge | null;
  fetchChallenge: () => void;
}

const ChallengeContext = createContext<ChallengeContextProps | undefined>(
  undefined,
);

export const ChallengeProvider: React.FC = ({ children }) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const { user } = useAuth();
  const fetchChallenge = async () => {
    try {
      const response = await axios.post<{ challenge: Challenge }>(
        "/api/challenges/generate-challenge",
        { job: user?.job, userId: user?._id },
      );

      setChallenge(response.data.challenge);
    } catch (err) {
      console.error("Error fetching challenge:", err);
    }
  };

  useEffect(() => {
    fetchChallenge(); // Fetch challenge as soon as the app loads
  }, [user]);

  return (
    <ChallengeContext.Provider value={{ challenge, fetchChallenge }}>
      {children}
    </ChallengeContext.Provider>
  );
};

// Hook to use the Challenge context
export const useChallenge = (): ChallengeContextProps => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error("useChallenge must be used within a ChallengeProvider");
  }
  return context;
};
