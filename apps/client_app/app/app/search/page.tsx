"use client";

import { useEffect, useState } from "react";
import { PostData } from "@/app/components/ProfileComponent";
import { apiClient } from "@/apiClient";
import Post from "@/app/components/Post";

export default function Search() {
    const [searched, setSearched] = useState("");
    const [input, setInput] = useState("");
    const [results, setResults] = useState<PostData[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSearchRes = async () => {
            if (!searched.trim()) {
                setResults([]);
                return;
            }

            try {
                setError("");
                const { data } = await apiClient.get(`/posts/search/${searched}`);
                setResults(data.data);
            } catch {
                setError("Something went wrong. Please try again.");
            }
        };
        fetchSearchRes();
    }, [searched]);

    return (
        <div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Search</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setSearched(input);
                }}
                className="relative mb-8"
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <input
                    type="text"
                    placeholder="Search posts..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-gray-100 text-gray-900 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-colors border border-transparent focus:border-gray-300"
                />

                {input && (
                    <button
                        type="button"
                        onClick={() => {
                            setInput('');
                            setSearched('');
                            setResults([]);
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}

                <button type="submit" className="hidden">Search</button>
            </form>

            {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            {searched && results.length === 0 && !error && (
                <p className="text-gray-500 text-center mt-10 text-sm">
                    No results found for <span className="font-semibold">&#34;{searched}&#34;</span>
                </p>
            )}

            <div className="flex flex-col gap-6">
                {results.map((e) => (
                    <Post
                        key={e.id}
                        id={e.id}
                        profileId={e.profileId}
                        content={e.content}
                        isArchived={e.isArchived}
                        createdAt={e.createdAt}
                        createdById={e.createdById}
                        updatedAt={e.updatedAt}
                        updatedById={e.updatedById}
                        postAssets={e.postAssets}
                    />
                ))}
            </div>
        </div>
    );
}