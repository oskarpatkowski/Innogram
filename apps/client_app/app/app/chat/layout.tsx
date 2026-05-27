"use client";

import React, {ReactNode} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";

export default function ChatLayout ({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const getLinkStyle = (path: string, exact: boolean = false) => {
        const normalizedPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
        const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;

        const isActive = exact
            ? normalizedPathname === normalizedPath
            : normalizedPathname === normalizedPath || normalizedPathname.startsWith(normalizedPath + '/');

        return `flex items-center gap-4 mb-2 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
            isActive
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-black"
        }`;
    };

    return(
        <section className="flex flex-row">
            <nav className="w-64 shrink-0 flex flex-col items-start px-4 py-6 border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
                <h1 className="text-3xl font-extrabold mb-10 px-4 tracking-tight text-black">Chats</h1>
                <div className="w-full flex flex-col gap-1">
                    <Link
                        href='/app/chat/'
                        className={getLinkStyle('/app/chat/', true)}
                    >
                        Your chats
                    </Link>
                    <Link
                        href='/app/chat/create/'
                        className={getLinkStyle('/app/chat/create/')}
                    >
                        Create a chat
                    </Link>
                    <Link
                        href='/app/chat/group/'
                        className={getLinkStyle('/app/chat/group/')}
                    >
                        Group chats
                    </Link>
                </div>
            </nav>
            <main className="flex-1 min-w-0 bg-white">
                {children}
            </main>
        </section>
    )
}