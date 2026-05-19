"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { apiClient } from "@/apiClient";

export interface ProfileData {
    id: string;
    username: string;
    displayName: string;
    birthday: Date;
    bio: string;
    avatarUrl: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    userId: string;
    createdById: string;
    updatedById: string | null;
}

export interface Asset {
    id: string;
    filePath: string;
    fileType: string;
}

export interface PostAsset {
    id: string;
    asset: Asset;
}

export interface PostData {
    id: string;
    profileId: string;
    content: string;
    isArchived: boolean;
    createdAt: Date;
    createdById: string;
    updatedAt: Date;
    updatedById: string | null;
    postAssets: PostAsset[];
}

interface UserProfileProps {
    profileId?: string;
}

export function UserProfile({ profileId }: UserProfileProps) {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "tagged">("posts");
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);

    const observer = useRef<IntersectionObserver>(null);

    // 1. Handle profile meta data queries
    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoadingProfile(true);
            try {
                const profileRoute = profileId ? `/profiles/${profileId}` : "/profiles/me";
                const { data: profileData } = await apiClient.get(profileRoute);
                setProfile(profileData);

                const currentProfileId = profileId || profileData.id;

                let followersCount = 0;
                let followingCount = 0;
                try {
                    const followersRes = await apiClient.get(
                        profileId ? `/profiles/followers/${currentProfileId}` : "/profiles/followers"
                    );
                    followersCount = followersRes.data?.length || 0;

                    const followingRes = await apiClient.get("/profiles/following");
                    followingCount = followingRes.data?.length || 0;
                } catch (e) {
                    console.warn("Could not fetch connection stats", e);
                }

                setStats((prev) => ({
                    ...prev,
                    followers: followersCount,
                    following: followingCount,
                }));
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfileData();
    }, [profileId]);

    // 2. INITIAL FETCH: Runs only when profileId or activeTab changes
    useEffect(() => {
        // 'ignore' prevents race conditions if the user rapidly clicks between tabs
        let ignore = false;

        const loadInitialPosts = async () => {
            setIsPostsLoading(true);
            try {
                const postsRoute = activeTab === "posts"
                    ? (profileId ? `/posts/profile/${profileId}` : "/posts/my")
                    : (profileId ? `/posts/${profileId}/mentions` : "/posts/my/mentions");

                const { data: postsResponse } = await apiClient.get(postsRoute, {
                    params: { take: 12, lastCursor: null },
                });

                if (!ignore) {
                    const { data, metaData } = postsResponse;
                    if (Array.isArray(data)) {
                        setPosts(data); // Set fresh data, clearing out stale list
                        if (activeTab === "posts") {
                            setStats(prevStats => ({ ...prevStats, posts: data.length }));
                        }
                        setNextCursor(metaData.lastCursor);
                        setHasNextPage(metaData.hasNextPage);
                    }
                }
            } catch (e) {
                console.error("Error fetching initial posts:", e);
            } finally {
                if (!ignore) setIsPostsLoading(false);
            }
        };

        loadInitialPosts();

        // Cleanup function for rapid tab switching
        return () => { ignore = true; };
    }, [profileId, activeTab]);

    // 3. PAGINATION FETCH: Handled entirely separate from the synchronization effect
    const loadMorePosts = useCallback(async () => {
        if (!hasNextPage || isPostsLoading || !nextCursor) return;

        setIsPostsLoading(true);
        try {
            const postsRoute = activeTab === "posts"
                ? (profileId ? `/posts/profile/${profileId}` : "/posts/my")
                : (profileId ? `/posts/${profileId}/mentions` : "/posts/my/mentions");

            const { data: postsResponse } = await apiClient.get(postsRoute, {
                params: { take: 12, lastCursor: nextCursor },
            });

            const { data, metaData } = postsResponse;

            if (Array.isArray(data)) {
                setPosts(prev => {
                    const combined = [...prev, ...data];
                    if (activeTab === "posts") {
                        setStats(prevStats => ({ ...prevStats, posts: combined.length }));
                    }
                    return combined;
                });
                setNextCursor(metaData.lastCursor);
                setHasNextPage(metaData.hasNextPage);
            }
        } catch (e) {
            console.error("Error fetching more posts:", e);
        } finally {
            setIsPostsLoading(false);
        }
    }, [activeTab, profileId, hasNextPage, isPostsLoading, nextCursor]);

    // 4. OBSERVER: Triggers the pagination
    const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isPostsLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && nextCursor) {
                loadMorePosts();
            }
        });
        if (node) observer.current.observe(node);
    }, [isPostsLoading, hasNextPage, nextCursor, loadMorePosts]);

    if (isLoadingProfile) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center mt-10 text-gray-500">Profile not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white w-full">
            <header className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-10">
                <div className="w-full sm:w-1/3 flex justify-center shrink-0">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt={`${profile.username}'s avatar`}
                            className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border border-gray-200 p-1"
                        />
                    ) : (
                        <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-gray-100 border border-gray-200 p-1 flex items-center justify-center">
                          <span className="text-gray-500 text-4xl sm:text-6xl font-light uppercase">
                            {profile.displayName ? profile.displayName[0] : profile.username[0]}
                          </span>
                        </div>
                    )}
                </div>

                <div className="w-full sm:w-2/3 flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-xl sm:text-2xl font-normal text-gray-900">
                            {profile.username}
                        </h1>
                    </div>

                    <div className="flex gap-6 sm:gap-10 mb-4 text-sm sm:text-base text-gray-900">
                        <span>
                          <span className="font-semibold">{stats.posts}</span> posts
                        </span>
                        <span>
                          <span className="font-semibold">{stats.followers}</span> followers
                        </span>
                        <span>
                          <span className="font-semibold">{stats.following}</span> following
                        </span>
                    </div>

                    <div className="text-sm text-gray-900">
                        <p className="font-semibold">{profile.displayName}</p>
                        <p className="text-gray-500">
                            {profile.isPublic ? "Public Account" : "Private Account"}
                        </p>
                        <p className="whitespace-pre-wrap mt-1">{profile.bio}</p>
                    </div>
                </div>
            </header>

            {/* TABS */}
            <div className="border-t border-gray-200">
                <div className="flex justify-center gap-12">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`h-12 flex items-center gap-2 border-t-[1px] text-xs font-semibold tracking-widest transition-colors ${
                            activeTab === "posts"
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        POSTS
                    </button>

                    <button
                        onClick={() => setActiveTab("tagged")}
                        className={`h-12 flex items-center gap-2 border-t-[1px] text-xs font-semibold tracking-widest transition-colors ${
                            activeTab === "tagged"
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        TAGGED
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4 mt-2">
                {posts.map((post, index) => {
                    const isLastElement = posts.length === index + 1;
                    return (
                        <div
                            ref={isLastElement ? lastPostElementRef : undefined}
                            key={post.id}
                            className="aspect-square bg-gray-200 relative group overflow-hidden cursor-pointer hover:blur-xs transition-all"
                            onClick={() => {
                                window.location.href = `/app/posts/${post.id}`;
                            }}
                        >
                            {post.postAssets && post.postAssets.length > 0 ? (
                                post.postAssets[0].asset.fileType.startsWith("video/") ? (
                                    <video
                                        src={post.postAssets[0].asset.filePath}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={post.postAssets[0].asset.filePath}
                                        alt="Post content"
                                        className="w-full h-full object-cover"
                                    />
                                )
                            ) : (
                                <div className="w-full h-full p-2 flex items-center justify-center text-center text-xs sm:text-sm text-gray-800 break-words bg-gray-100">
                                    {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {isPostsLoading && (
                <div className="flex justify-center items-center h-32 mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                </div>
            )}

            {!isPostsLoading && posts.length === 0 && !profile.isPublic && profileId && (
                <div className="col-span-3 text-center py-12 text-sm text-gray-500">
                    This account is private. Follow to see their photos and videos.
                </div>
            )}

            {!isPostsLoading && posts.length === 0 && (profile.isPublic || !profileId) && (
                <div className="col-span-3 text-center py-12 text-sm text-gray-500">
                    No {activeTab === "tagged" ? "photos or videos" : "posts"} yet.
                </div>
            )}
        </div>
    );
}