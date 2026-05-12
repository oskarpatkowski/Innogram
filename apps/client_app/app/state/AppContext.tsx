"use client";

import { apiClient } from "@/apiClient";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface User {
  id: string;
  accountId: string;
  name: string;
  role: string;
}

export interface AppState {
  user: User | null;
  isInitializing: boolean;
}

export interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>({
    user: null,
    isInitializing: true,
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiClient.post("/auth/validate");
        if (response.data.isValid) {
          const { tokenPayload } = response.data;
          setState({
            user: {
              id: tokenPayload.userId || "",
              accountId: tokenPayload.profileId || "",
              name: "User",
              role: tokenPayload.role || "user",
            },
            isInitializing: false,
          });
          return;
        }
      } catch (error) {}

      setState((prev) => ({ ...prev, isInitializing: false }));
    };

    checkSession();
  }, []);

  const login = (user: User) => setState((prev) => ({ ...prev, user }));
  const logout = () => {
    apiClient.post("/auth/logout").catch(() => {});
    setState((prev) => ({ ...prev, user: null }));
  };
  const isAuthenticated = !!state.user;

  return (
    <AppContext.Provider
      value={{ state, setState, isAuthenticated, login, logout }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}
