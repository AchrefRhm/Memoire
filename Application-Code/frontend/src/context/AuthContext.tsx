import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios"; // For API calls
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  job: string;
  img: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    username: string,
    email: string,
    password: string,
    job: string,
  ) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      if (user.isAdmin) {
        router.push("/admin/paymentStatics");
      } else router.push("/"); // Redirect after login
    } catch (error) {
      console.error("Sign In Error:", error);
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    job: string,
  ) => {
    try {
      await axios.post("/api/auth/register", {
        username,
        email,
        password,
        job,
      });
      await signIn(email, password); // Auto login after signup
    } catch (error) {
      console.error("Sign Up Error:", error);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/auth/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
