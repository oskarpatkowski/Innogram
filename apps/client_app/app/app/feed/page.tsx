"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PostData } from "@/app/components/ProfileComponent";
import { apiClient } from "@/apiClient";
import { AxiosError } from "axios";
import Post from "@/app/components/Post";

type SortBy = 'latest' | 'likes';
type Timeframe = 'day' | 'week' | 'month' | 'year' | 'all';

interface Params {
    take: number;
    lastCursor: string | null;
    timeframe?: Timeframe;
}

export default function Page() {
    const [postsData, setPostsData] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<SortBy>('latest');
    const [timeframe, setTimeframe] = useState<Timeframe>('all');

    const observer = useRef<IntersectionObserver>(null);
    const isMounted = useRef(false);

    const fetchPosts = useCallback(async (cursor: string | null = null, newSortBy?: SortBy, newTimeframe?: Timeframe) => {
        setLoading(true);
        const currentSort = newSortBy || sortBy;
        const isNewSort = !!newSortBy || !!newTimeframe;
        const currentTimeframe = newTimeframe || timeframe;

        const endpoint = currentSort === 'likes' ? 'posts/popular' : 'posts/feed';

        const params: Params = {
            take: 5,
            lastCursor: isNewSort ? null : cursor,
            timeframe: currentTimeframe,
        };

        try {
            const response = await apiClient.get(endpoint, { params });
            const { data, metaData } = response.data;

            if (Array.isArray(data)) {
                if (isNewSort) {
                    setPostsData(data);
                } else {
                    setPostsData(prev => {
                        const newPosts = data.filter(d => !prev.some(p => p.id === d.id));
                        return [...prev, ...newPosts];
                    });
                }
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
    }, [sortBy, timeframe]);

    useEffect(() => {
        if (!isMounted.current) {
            fetchPosts(null);
            isMounted.current = true;
        }
    }, [fetchPosts]);

    const handleSortChange = (newSort: SortBy) => {
        if (newSort !== sortBy) {
            setSortBy(newSort);
            setNextCursor(null);
            setPostsData([]);
            fetchPosts(null, newSort);
        }
    };

    const handleTimeframeChange = (newTimeframe: Timeframe) => {
        if (newTimeframe !== timeframe) {
            setTimeframe(newTimeframe);
            setNextCursor(null);
            setPostsData([]);
            fetchPosts(null, sortBy, newTimeframe);
        }
    };

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
            <div className="w-full max-w-[470px] flex justify-center my-4">
                <button
                    onClick={() => handleSortChange('latest')}
                    className={`px-4 py-2 text-sm font-semibold rounded-l-md transition-colors ${sortBy === 'latest' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Latest
                </button>
                <button
                    onClick={() => handleSortChange('likes')}
                    className={`px-4 py-2 text-sm font-semibold rounded-r-md transition-colors ${sortBy === 'likes' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Popular
                </button>
            </div>

            <div className="w-full max-w-[470px] flex justify-center mb-4">
                <select
                    value={timeframe}
                    onChange={(e) => handleTimeframeChange(e.target.value as Timeframe)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                >
                    <option value="all">All Time</option>
                    <option value="day">Last 24 hours</option>
                    <option value="week">Last week</option>
                    <option value="month">Last month</option>
                    <option value="year">Last year</option>
                </select>
            </div>

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