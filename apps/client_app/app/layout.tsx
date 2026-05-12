import Layout from "./components/layout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./globals.css";
import { AppProvider } from "./state/AppContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body>
        <AppProvider>
          <ProtectedRoute>
            <Layout>{children}</Layout>
          </ProtectedRoute>
        </AppProvider>
      </body>
    </html>
  );
}
