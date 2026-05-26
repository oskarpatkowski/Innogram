"use client";

import {useEffect, useState} from "react";
import {apiClient} from "@/apiClient";

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | { [key: string]: JsonValue }
    | JsonValue[];

export enum NotificationType {
    LIKE = 'LIKE',
    COMMENT = 'COMMENT',
    FOLLOW = 'FOLLOW',
    MENTION = 'MENTION',
    SYSTEM = 'SYSTEM',
}

export interface Notification {
    id: string;
    createdAt: string;
    updatedAt: string;
    createdById: string;
    updatedById: string | null;
    message: string;
    type: NotificationType;
    title: string;
    isRead: boolean;
    readAt: string | null;
    recipientId: string;
    data: JsonValue;
}

export interface UpdateNotificationDto {
    isRead?: boolean;
    readAt?: string | Date | null;
}

export function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
}

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data }  = await apiClient.get('/notifications');
            setNotifications(data);
        } catch  {
            setError("error fetching notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            await fetchNotifications();
        }

        fetch();
    }, []);

    const markAsRead = async (id: string, isCurrentlyRead: boolean) => {
        if (isCurrentlyRead) return;

        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );

        try {
            const updateData: UpdateNotificationDto = {
                isRead: true,
                readAt: new Date().toISOString(),
            };

            await apiClient.put(`/notifications/${id}`, updateData);
        } catch (err) {
            console.error('Failed to mark notification as read', err);
            fetchNotifications();
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-md mx-auto p-4 bg-white min-h-[400px]">
                <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
                        <div className="w-11 h-11 bg-gray-200 rounded-full shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white border-x border-gray-100 min-h-screen sm:min-h-[600px]">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>

            <div className="flex flex-col">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No notifications yet.
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id, notif.isRead)}
                            className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                            !notif.isRead ? 'bg-blue-50/50' : ''
                            }`
                             }
                        >
                            <div className="relative shrink-0">
                                <div className="w-11 h-11 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full p-[2px]">
                                    <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-700">
                                            {notif.title.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 line-clamp-2">
                                    <span className="font-semibold mr-1">
                                        {notif.title}
                                    </span>

                                    {notif.message}

                                    <span className="text-gray-500 ml-2 whitespace-nowrap">
                                        {formatTimeAgo(notif.createdAt)}
                                    </span>
                                </p>
                            </div>

                            <div className="shrink-0 flex items-center gap-3">
                            {!notif.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}

                            {notif.type === 'FOLLOW' && (
                            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1.5 px-4 rounded-lg transition-colors">
                            Follow
                            </button>
                            )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
