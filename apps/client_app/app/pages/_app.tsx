import type { AppProps } from "next/app";
import ProtectedRoute from "../components/ProtectedRoute";
import { AppProvider } from "../state/AppContext";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <ProtectedRoute>
        <Component {...pageProps} />
      </ProtectedRoute>
    </AppProvider>
  );
}
