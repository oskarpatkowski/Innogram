import { cookies } from "next/headers";
import Layout from "./components/layout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./globals.css";
import { AppProvider, User } from "./state/AppContext";

//JSON.parse returns any
/* eslint-disable @typescript-eslint/no-explicit-any */
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let initialUser: User | null = null;

  if (accessToken) {
    const payload = decodeJwt(accessToken);
    if (payload) {
      initialUser = {
        id: payload.userId || "",
        accountId: payload.profileId || "",
        name: "User",
        role: payload.role || "user",
      };
    }
  }

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body>
        <AppProvider initialUser={initialUser}>
          <ProtectedRoute>
            <Layout>{children}</Layout>
          </ProtectedRoute>
        </AppProvider>
      </body>
    </html>
  );
}
