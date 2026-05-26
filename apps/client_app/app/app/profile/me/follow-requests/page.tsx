"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProfileData } from "@/app/components/ProfileComponent";
import { apiClient } from "@/apiClient";

interface FollowRequest {
    id: string;
    followerProfileId: string;
    followingProfileId: string;
    accepted: boolean | null;
    followerProfile?: ProfileData;
}

export default function FollowRequests() {
    const [requests, setRequests] = useState<FollowRequest[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await apiClient.get('/profiles/follow-requests');
                const requestsWithProfiles = await Promise.all((data || []).map(async (req: FollowRequest) => {
                    try {
                        const profileRes = await apiClient.get(`/profiles/${req.followerProfileId}`);
                        return { ...req, followerProfile: profileRes.data };
                    } catch {
                        return req;
                    }
                }));
                setRequests(requestsWithProfiles);
            } catch {
                setError("Couldn't fetch follow requests");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAccept = async (requestId: string) => {
        setActionLoading(requestId);
        try {
            await apiClient.patch(`/profiles/accept/${requestId}`);
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (error) {
            console.error("Failed to accept request", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requestId: string) => {
        setActionLoading(requestId);
        try {
            await apiClient.delete(`/profiles/reject/${requestId}`);
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (error) {
            console.error("Failed to reject request", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <span className="text-gray-400 text-sm">Loading requests...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4 text-sm">{error}</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white w-full">
            <div className="flex flex-col">
                <h2 className="px-4 py-4 text-lg font-bold border-b border-gray-100">Follow Requests</h2>
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                            {req.followerProfile ? (
                                <>
                                    <Link
                                        href={`/app/profile/${req.followerProfile.username}`}
                                        className="flex items-center gap-3 flex-1"
                                    >
                                        <div className="flex-shrink-0">
                                            {req.followerProfile.avatarUrl ? (
                                                <img
                                                    src={req.followerProfile.avatarUrl}
                                                    alt={`${req.followerProfile.username}'s avatar`}
                                                    className="w-11 h-11 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-lg font-light uppercase">
                                                        {req.followerProfile.displayName ? req.followerProfile.displayName[0] : req.followerProfile.username[0]}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <span className="text-sm font-semibold text-gray-900 leading-tight">
                                                {req.followerProfile.username}
                                            </span>
                                            {req.followerProfile.displayName && (
                                                <span className="text-sm text-gray-500 leading-tight">
                                                    {req.followerProfile.displayName}
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(req.id)}
                                            disabled={actionLoading === req.id}
                                            className="bg-blue-500 text-white text-sm font-semibold py-1.5 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            disabled={actionLoading === req.id}
                                            className="bg-gray-100 text-gray-900 text-sm font-semibold py-1.5 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <span className="text-sm text-gray-500">Loading profile...</span>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-gray-500 text-sm">
                        No pending follow requests.
                    </div>
                )}
            </div>
        </div>
    );
}
