"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "../state/AppContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    state: { isInitializing },
  } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = pathname?.startsWith("/auth") ?? false;
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated && !isAuthRoute && !isHomePage) {
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`,
      );
    } else if (isAuthenticated && isAuthRoute) {
      router.push("/feed");
    }
  }, [
    isAuthenticated,
    isAuthRoute,
    isHomePage,
    pathname,
    router,
    isInitializing,
  ]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 font-medium">Loading session...</div>
      </div>
    );
  }

  if (!isAuthenticated && !isAuthRoute && !isHomePage) {
    return null;
  }

  return <>{children}</>;
}
