import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppContext } from "../state/AppContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAppContext();
  const router = useRouter();

  const isAuthRoute = router.pathname.startsWith("/auth");

  useEffect(() => {
    if (!isAuthenticated && !isAuthRoute) {
      router.push("/auth/signin");
    } else if (isAuthenticated && isAuthRoute) {
      router.push("/app/feed");
    }
  }, [isAuthenticated, isAuthRoute, router]);

  if (!isAuthenticated && !isAuthRoute) {
    return null;
  }

  return <>{children}</>;
}
