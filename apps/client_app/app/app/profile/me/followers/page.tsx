"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProfileData } from "@/app/components/ProfileComponent";
import { apiClient } from "@/apiClient";

export default function Followers() {
    const [followers, setFollowers] = useState<ProfileData[]>([]);
    const [isPrivate, setIsPrivate] = useState<boolean | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [followersRes, profileRes] = await Promise.all([
                    apiClient.get('/profiles/followers'),
                    apiClient.get('/profiles/me')
                ]);
                setFollowers(followersRes.data || []);
                setIsPrivate(!profileRes.data?.isPublic);
            } catch {
                setError("Couldn't fetch data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleRemoveFollower = async (followerId: string) => {
        setRemovingIds(prev => new Set(prev).add(followerId));
        try {
            await apiClient.delete(`/profiles/followers/${followerId}`);
            setFollowers(prev => prev.filter(f => f.id !== followerId));
        } catch (error) {
            console.error("Failed to remove follower", error);
        } finally {
            setRemovingIds(prev => {
                const next = new Set(prev);
                next.delete(followerId);
                return next;
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <span className="text-gray-400 text-sm">Loading followers...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4 text-sm">{error}</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white w-full">
            <div className="flex flex-col">
                {followers.length > 0 ? (
                    followers.map((follower) => (
                        <div
                            key={follower.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                            <Link
                                href={`/app/profile/${follower.username}`}
                                className="flex items-center gap-3 flex-1"
                            >
                                <div className="flex-shrink-0">
                                    {follower.avatarUrl ? (
                                        <img
                                            src={follower.avatarUrl}
                                            alt={`${follower.username}'s avatar`}
                                            className="w-11 h-11 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-lg font-light uppercase">
                                                {follower.displayName ? follower.displayName[0] : follower.username[0]}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-center">
                                    <span className="text-sm font-semibold text-gray-900 leading-tight">
                                        {follower.username}
                                    </span>
                                    {follower.displayName && (
                                        <span className="text-sm text-gray-500 leading-tight">
                                            {follower.displayName}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {isPrivate && (
                                <button
                                    onClick={() => handleRemoveFollower(follower.id)}
                                    disabled={removingIds.has(follower.id)}
                                    className="ml-3 bg-gray-100 text-gray-900 text-sm font-semibold py-1.5 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {removingIds.has(follower.id) ? 'Removing...' : 'Remove'}
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-gray-500 text-sm">
                        You don&#39;t have any followers yet.
                    </div>
                )}
            </div>
        </div>
    );
}
