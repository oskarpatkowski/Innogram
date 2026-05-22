"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProfileData } from "@/app/components/ProfileComponent";
import { apiClient } from "@/apiClient";

export default function Following() {
    const [following, setFollowing] = useState<ProfileData[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const { data } = await apiClient.get('/profiles/following');
                setFollowing(data || []);
            } catch {
                setError("Couldn't fetch following list");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowing();
    }, []);

    const handleUnfollow = async (targetProfileId: string) => {
        setIsActionLoading(targetProfileId);
        try {
            await apiClient.delete(`/profiles/unfollow/${targetProfileId}`);
            setFollowing(prev => prev.filter(p => p.id !== targetProfileId));
        } catch (error) {
            console.error("Failed to unfollow user", error);
        } finally {
            setIsActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <span className="text-gray-400 text-sm">Loading following...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4 text-sm">{error}</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white w-full">
            <div className="flex flex-col">
                {following.length > 0 ? (
                    following.map((profile) => (
                        <div
                            key={profile.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <Link
                                href={`/app/profile/${profile.username}`}
                                className="flex items-center gap-3 flex-1"
                            >
                                <div className="flex-shrink-0">
                                    {profile.avatarUrl ? (
                                        <img
                                            src={profile.avatarUrl}
                                            alt={`${profile.username}'s avatar`}
                                            className="w-11 h-11 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-lg font-light uppercase">
                                                {profile.displayName ? profile.displayName[0] : profile.username[0]}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-center">
                                    <span className="text-sm font-semibold text-gray-900 leading-tight">
                                        {profile.username}
                                    </span>
                                    {profile.displayName && (
                                        <span className="text-sm text-gray-500 leading-tight">
                                            {profile.displayName}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            <button
                                onClick={() => handleUnfollow(profile.id)}
                                disabled={isActionLoading === profile.id}
                                className="ml-3 bg-gray-100 text-gray-900 text-sm font-semibold py-1.5 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {isActionLoading === profile.id ? "Unfollowing..." : "Unfollow"}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-gray-500 text-sm">
                        You are not following anyone yet.
                    </div>
                )}
            </div>
        </div>
    );
}
