"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

import {
  checkEmailAPI,
  loginAPI,
  registerAPI,
  verifyAPI,
} from "@/app/_api/AuthAPIs";

import { jwtDecode } from "jwt-decode";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (
      email: string,
      name: string,
      lastName: string,
      password: string
      , avatarSrc: string | null) => Promise<any>;
  checkEmail: (email: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log("🔁 AuthProvider mounted");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  };

  const decodeAndSetToken = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    const user = decoded as User;
    setCurrentUser(user);

    if (!decoded.exp) {
      console.error("Token does not have an expiration date.");
      removeToken();
      return;
    }

    console.log("Token expires at:", new Date(decoded.exp * 1000));

    if (Date.now() >= decoded.exp * 1000) {
      removeToken();
      console.log("Token expired. User logged out.");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log(
      "Checking token on mount:",
      storedToken ? "Token exists" : "No token"
    );

    if (storedToken) {
      verifyAPI(storedToken)
        .then((res) => {
          if (res.status === 200) {
            decodeAndSetToken(storedToken);
            console.log("Token verified successfully.");
          } else {
            removeToken();
            console.log("Token verification failed. User logged out.");
          }
        })
        .catch((err) => {
          console.error("Token verification failed:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Token state updated:", token);
    console.log("isAuthenticated updated:", !!token);
  }, [token]);

  const login = async (email: string, password: string): Promise<any> => {
    const response = await loginAPI(email, password);
    const token = response.data.token;
    decodeAndSetToken(token);

    return response;
  };

  const checkEmail = async (email: string): Promise<any> => {
    const res = await checkEmailAPI(email);

    return res;
  };
  const register = async (
    email: string,
    name: string,
    lastName: string,
    password: string,
    avatarUrl?:string,
  ): Promise<any> => {
    const res = await registerAPI(email, name, lastName, password,avatarUrl);
    console.log(res.data);
    return res;
  };

  const logout = () => {
    removeToken();
  };

  const value = {
    currentUser,
    token,
    login,
    register,
    checkEmail,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
