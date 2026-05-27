'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { apiClient } from "@/apiClient";
import { useRouter } from 'next/navigation';
import { ProfileData } from "@/app/components/ProfileComponent";

export enum ChatType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP'
}

export interface ChatParticipant {
    profile: ProfileData;
}

export interface ChatData {
    id: string;
    name: string;
    description: string;
    type: ChatType;
    createdById: string;
    participants: ChatParticipant[];
}

export default function ChatList() {
    const [chats, setChats] = useState<ChatData[]>([]);
    const [currentUser, setCurrentUser] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data: user } = await apiClient.get<ProfileData>('/profiles/me');
                setCurrentUser(user);

                if (user?.id) {
                    const { data: userChats } = await apiClient.get<ChatData[]>(`/chats/profile/${user.id}`);
                    setChats(userChats);
                }
            } catch (error) {
                console.error("Failed to fetch chats or profile data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleChatClick = (chatId: string) => {
        router.push(`/app/chat/${chatId}`);
    };

    const handleDeleteChat = async (e: MouseEvent<HTMLButtonElement>, chatId: string) => {
        e.stopPropagation();

        const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
        if (!confirmDelete) return;

        try {
            await apiClient.delete(`/chats/${chatId}`);
            setChats(prev => prev.filter(chat => chat.id !== chatId));
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const handleLeaveChat = async (e: MouseEvent<HTMLButtonElement>, chatId: string) => {
        e.stopPropagation();

        const confirmLeave = window.confirm("Are you sure you want to leave this chat?");
        if (!confirmLeave) return;

        try {
            setChats(prev => prev.filter(c => c.id !== chatId));
        } catch (error) {
            console.error('Error leaving chat:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
                <p className="text-neutral-500">Loading chats...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border border-neutral-300 rounded-md shadow-sm">
                <div className="p-4 border-b border-neutral-200">
                    <h1 className="text-lg font-semibold text-neutral-800 text-center">Your Chats</h1>
                </div>

                <div className="flex flex-col">
                    {chats.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500">
                            You are not part of any chats yet.
                        </div>
                    ) : (
                        chats.map((chat) => {
                            const isOwner = chat.createdById === currentUser?.userId;
                            const otherParticipant = chat.type === ChatType.PRIVATE && chat.participants
                                ? chat.participants.find(p => p.profile.id !== currentUser?.id)?.profile
                                : null;

                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => handleChatClick(chat.id)}
                                    className="p-4 border-b border-neutral-200 last:border-b-0 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex flex-col pr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-neutral-800">
                                                {chat.type === ChatType.PRIVATE && otherParticipant
                                                    ? `Private chat with: ${otherParticipant.username}`
                                                    : chat.name}
                                            </span>
                                            {isOwner && (
                                                <span className="bg-neutral-200 text-neutral-600 text-xs font-semibold px-2 py-0.5 rounded">
                                                    Owner
                                                </span>
                                            )}
                                            {chat.type === ChatType.GROUP && chat.participants && (
                                                <span className="text-sm text-neutral-500">
                                                    ({chat.participants.length} members)
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-neutral-500 truncate max-w-[200px] sm:max-w-[250px]">
                                            {chat.description}
                                        </span>
                                    </div>

                                    <div>
                                        {isOwner ? (
                                            <button
                                                onClick={(e) => handleDeleteChat(e, chat.id)}
                                                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-3 rounded text-sm transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => handleLeaveChat(e, chat.id)}
                                                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-1.5 px-3 rounded text-sm transition-colors duration-200"
                                            >
                                                Leave
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-4 bg-neutral-50 rounded-b-md">
                    <button
                        onClick={() => router.push('/app/chat/create')}
                        className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded transition-colors duration-200 cursor-pointer"
                    >
                        Create New Chat
                    </button>
                </div>
            </div>
        </div>
    );
}
