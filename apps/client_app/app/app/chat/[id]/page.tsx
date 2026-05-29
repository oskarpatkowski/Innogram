'use client';

import { useEffect, useState, useRef } from "react";
import { apiClient } from "@/apiClient";
import { useParams, useRouter } from "next/navigation";
import { ProfileData } from "@/app/components/ProfileComponent";
import { io, Socket } from "socket.io-client";

interface Message {
    id: string;
    content: string;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    chatId: string;
    profileId: string;
    replyToMessageId: string | null;
    createdById: string;
    updatedById: string | null;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [socket, setSocket] = useState<Socket | null>(null);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

    const params = useParams();
    const router = useRouter();
    const chatId = params.id as string;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const { data: user } = await apiClient.get<ProfileData>('/profiles/me');
                setCurrentUser(user);

                const { data: messagesData } = await apiClient.get(`/messages/chat/${chatId}`);
                setMessages(messagesData);
            } catch (err) {
                console.error(err);
                setError("Couldn't fetch chat details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchChatData();
    }, [chatId]);

    useEffect(() => {
        const createSocket = async () => {
            const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

            const newSocket = io(`${socketUrl}/chat`, {
                withCredentials: true,
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to chat socket');
            });

            newSocket.on('newMessage', (message: Message) => {
                setMessages((prev) => [...prev, message]);
            });

            newSocket.on('messageUpdated', (updatedMessage: Message) => {
                setMessages((prev) =>
                    prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
                );
            });

            newSocket.on('messageDeleted', ({ messageId }: { messageId: string }) => {
                setMessages((prev) => prev.filter(msg => msg.id !== messageId));
            });

            newSocket.on('typing', ({ profileId }: { profileId: string }) => {
                if (profileId === currentUser?.id) return; // Ignore own typing events
                setTypingUsers((prev) => new Set(prev).add(profileId));
            });

            newSocket.on('stopTyping', ({ profileId }: { profileId: string }) => {
                setTypingUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(profileId);
                    return newSet;
                });
            });

            return () => {
                newSocket.disconnect();
            };
        }
        createSocket();
    }, [chatId, currentUser?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingUsers]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (socket) {
            socket.emit('typing', { chatId });

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('stopTyping', { chatId });
            }, 2000);
        }
    };

    const handleSendMessage = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !socket) return;

        socket.emit('sendMessage', {
            chatId,
            content: newMessage.trim()
        });

        socket.emit('stopTyping', { chatId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        const payload = {
            chatId: chatId,
            content: newMessage.trim(),
        }

        await apiClient.post(`/messages`, payload);

        setNewMessage("");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
                <p className="text-neutral-500 font-medium">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg h-[85vh] bg-white border border-neutral-300 rounded-md shadow-sm flex flex-col">

                <div className="p-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
                    <button
                        onClick={() => router.back()}
                        className="text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium text-sm">Back</span>
                    </button>
                    <h1 className="text-lg font-semibold text-neutral-800">Chat</h1>
                    <div className="w-12"></div> {/* Spacer to center the title */}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 text-center border-b border-red-100">
                        {error}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.createdById === currentUser?.userId || msg.profileId === currentUser?.id;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[75%] px-4 py-2.5 text-sm ${
                                            isMe
                                                ? "bg-black text-white rounded-l-2xl rounded-tr-2xl"
                                                : "bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-r-2xl rounded-tl-2xl"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {typingUsers.size > 0 && (
                        <div className="flex w-full justify-start mt-1">
                            <div className="bg-neutral-100 border border-neutral-200 rounded-full px-4 py-3 flex items-center gap-1.5 w-fit">
                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-neutral-200 bg-white rounded-b-md shrink-0">
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-3 relative"
                    >
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Message..."
                            className="flex-1 bg-neutral-100 text-neutral-900 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-neutral-300 transition-all placeholder:text-neutral-500"
                        />
                        {newMessage.trim() && (
                            <button
                                type="submit"
                                className="absolute right-4 text-black font-semibold text-sm hover:opacity-70 transition-opacity"
                            >
                                Send
                            </button>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
}