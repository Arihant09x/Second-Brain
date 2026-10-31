import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  username: string;
  email: string;
  id: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (raw: unknown): User | null => {
    if (!raw || typeof raw !== "object") return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u: any = raw;
    const username: string = u.username || u.login || u.name || "";
    const email: string = u.email || "";
    const id: string = String(u.id || u.sub || u.userId || "");
    const name: string | undefined = u.name || u.username || undefined;
    const avatarUrl: string | undefined =
      u.avatarUrl ||
      u.avatar_url ||
      u.avatarURL ||
      u.picture ||
      u.photoURL ||
      undefined;
    if (!username && !email && !id) return null;
    return { username: username || email || id, email, id, name, avatarUrl };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        const normalized = normalizeUser(parsed);
        setUser(normalized);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    const normalized = normalizeUser(userData) || null;
    setUser(normalized);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalized));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
