"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAppContext} from "@/app/state/AppContext";
import {apiClient} from "@/apiClient";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getLinkStyle = (path: string) => {
    const isActive = path === "/app/profile/me"
      ? pathname === path || pathname.startsWith(path + "/") 
      : pathname.startsWith(path);
      
    return `flex items-center gap-4 mb-2 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive 
        ? "bg-black text-white" 
        : "text-gray-700 hover:bg-gray-100 hover:text-black"
    }`;
  };

  const {
    isAuthenticated,
    logout,
  } = useAppContext();

  const handleLogout = async () => {
    try {
      logout();
      router.replace('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-row min-h-screen bg-white text-black">
      {isAuthenticated && (
        <nav className="w-64 shrink-0 flex flex-col items-start px-4 py-6 border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
          <h1 className="text-3xl font-extrabold mb-10 px-4 tracking-tight text-black">Innogram</h1>
          <div className="w-full flex flex-col gap-1 flex-1">

            <Link href={"/app/feed"} className={getLinkStyle("/app/feed")}>
              <span className="material-symbols-outlined text-2xl">home</span>
              <span className="text-lg">Home</span>
            </Link>
            <Link href={"/app/search"} className={getLinkStyle("/app/search")}>
              <span className="material-symbols-outlined text-2xl">search</span>
              <span className="text-lg">Search</span>
            </Link>
            <Link href={"/app/posts/create"} className={getLinkStyle("/app/posts/create")}>
              <span className="material-symbols-outlined text-2xl">add_box</span>
              <span className="text-lg">Create</span>
            </Link>
            <Link href={"/app/notifications"} className={getLinkStyle("/app/notifications")}>
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="text-lg">Notifications</span>
            </Link>
            <Link href={"/app/chat"} className={getLinkStyle("/app/chat")}>
              <span className="material-symbols-outlined text-2xl">chat</span>
              <span className="text-lg">Chat</span>
            </Link>
            <Link href={"/app/profile/me"} className={getLinkStyle("/app/profile/me")}>
              <span className="material-symbols-outlined text-2xl">person</span>
              <span className="text-lg">Profile</span>
            </Link>
          </div>
          <button
              className="flex items-center gap-4 mt-auto font-medium w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200"
              onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            <span className="text-lg">Logout</span>
          </button>
        </nav>
      )}

      <main className="flex-1 min-w-0 bg-white">
        {children}
      </main>
    </div>
  );
}
