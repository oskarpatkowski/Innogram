"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/app/state/AppContext";
import { apiClient } from "@/apiClient";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isPrivate, setIsPrivate] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await apiClient.get('/profiles/me');
                setIsPrivate(!data.isPublic);
            } catch (error) {
                console.error("Failed to fetch profile in layout", error);
            }
        };
        fetchProfile();
    }, []);

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

    const {
        state: {
            user
        }
    } = useAppContext();

    return (
        <section className="flex flex-row ">
            <nav className="w-64 shrink-0 flex flex-col items-start px-4 py-6 border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
                <h1 className="text-3xl font-extrabold mb-10 px-4 tracking-tight text-black">{user?.name}</h1>
                <div className="w-full flex flex-col gap-1">
                    <Link
                        href={'/app/profile/me'}
                        className={getLinkStyle('/app/profile/me', true)}
                    >
                        <span className="material-symbols-outlined text-2xl">person</span>
                        <span className="text-lg">My Profile</span>
                    </Link>
                    <Link
                        href={'/app/profile/me/edit'}
                        className={getLinkStyle('/app/profile/me/edit')}
                    >
                        <span className="material-symbols-outlined text-2xl">manage_accounts</span>
                        <span className="text-lg">Edit</span>
                    </Link>
                    {isPrivate && (
                        <Link
                            href={'/app/profile/me/follow-requests'}
                            className={getLinkStyle('/app/profile/me/follow-requests')}
                        >
                            <span className="material-symbols-outlined text-2xl">group_add</span>
                            <span className="text-lg">Follow requests</span>
                        </Link>
                    )}
                    <Link
                        href={'/app/profile/me/followers'}
                        className={getLinkStyle('/app/profile/me/followers')}
                    >
                        <span className="material-symbols-outlined text-2xl">group</span>
                        <span className="text-lg">Followers</span>
                    </Link>
                    <Link
                        href={'/app/profile/me/following'}
                        className={getLinkStyle('/app/profile/me/following')}
                    >
                        <span className="material-symbols-outlined text-2xl">group_remove</span>
                        <span className="text-lg">Following</span>
                    </Link>
                </div>
            </nav>
            <main className="flex-1 min-w-0 bg-white">
                {children}
            </main>
        </section>
    )
}
