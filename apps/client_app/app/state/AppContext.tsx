"use client";

import { apiClient } from "@/apiClient";
import {
  createContext,
  ReactNode,
  useContext,
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
  initialUser?: User | null;
}

export function AppProvider({ children, initialUser = null }: AppProviderProps) {
  const [state, setState] = useState<AppState>({
    user: initialUser,
    isInitializing: false,
  });

  const login = (user: User) => setState((prev) => ({ ...prev, user }));
  const logout = () => {
    apiClient.post("/auth/logout").finally(() => {
      setState((prev) => ({ ...prev, user: null }));
    });
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
