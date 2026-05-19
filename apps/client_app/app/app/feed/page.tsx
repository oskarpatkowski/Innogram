"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PostData } from "@/app/components/ProfileComponent";
import { apiClient } from "@/apiClient";
import { AxiosError } from "axios";
import Post from "@/app/components/Post";

export default function Page() {
    const [postsData, setPostsData] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loading, setLoading] = useState(false);

    const observer = useRef<IntersectionObserver>(null);
    const isMounted = useRef(false);

    const fetchPosts = useCallback(async (cursor: string | null = null) => {
        setLoading(true);
        try {
            const response = await apiClient.get('posts/feed', {
                params: {
                    take: 5,
                    lastCursor: cursor,
                },
            });

            const { data, metaData } = response.data;

            if (Array.isArray(data)) {
                setPostsData(prev => {
                    const newPosts = data.filter(d => !prev.some(p => p.id === d.id));
                    return [...prev, ...newPosts];
                });
                setNextCursor(metaData.lastCursor);
                setHasNextPage(metaData.hasNextPage);
            } else {
                console.error("Unexpected API response format:", response.data);
            }
        } catch (e: unknown) {
            setError((e as AxiosError).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isMounted.current) {
            fetchPosts(null);
            isMounted.current = true;
        }
    }, [fetchPosts]);

    const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && nextCursor) {
                fetchPosts(nextCursor);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasNextPage, nextCursor, fetchPosts]);

    return (
        <div className="flex flex-col items-center justify-center">
            {error && <div className="text-red-500 my-4">Failed to load feed: {error}</div>}

            {postsData.map((post, index) => {
                if (postsData.length === index + 1) {
                    return (
                        <div ref={lastPostElementRef} key={post.id} className="w-full">
                            <Post {...post} />
                        </div>
                    );
                } else {
                    return <Post key={post.id} {...post} />;
                }
            })}

            {loading && <p className="text-gray-500 my-4">Loading...</p>}
            {!loading && postsData.length === 0 && !error && <p className="text-gray-500 my-4">No posts found.</p>}
        </div>
    );
}