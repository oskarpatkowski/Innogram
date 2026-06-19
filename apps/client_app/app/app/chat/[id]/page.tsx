'use client';

import { useEffect, useState, useRef } from "react";
import { apiClient } from "@/apiClient";
import { useParams, useRouter } from "next/navigation";
import { ProfileData } from "@/app/components/ProfileComponent";
import { io, Socket } from "socket.io-client";

interface Asset {
    id: string;
    filePath: string;
    fileType: string;
}

interface MessageAsset {
    id: string;
    asset: Asset;
}

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
    assets: MessageAsset[];
    profile?: ProfileData;
}

interface ChatParticipant {
  id: string;
  profile: ProfileData;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

interface Chat {
  id: string;
  name: string;
  type: 'GROUP' | 'PRIVATE';
  participants: ChatParticipant[];
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [socket, setSocket] = useState<Socket | null>(null);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [uploadedAsset, setUploadedAsset] = useState<Asset | null>(null);


    const params = useParams();
    const router = useRouter();
    const chatId = params.id as string;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const { data: user } = await apiClient.get<ProfileData>('/profiles/me');
                setCurrentUser(user);

                const { data: chatData } = await apiClient.get(`/chats/${chatId}`);
                setChat(chatData);

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
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        const newSocket = io(`${socketUrl}/chat`, {
            withCredentials: true,
        });

        process.nextTick(
            () => {
                setSocket(newSocket);
            }
        )

        newSocket.on('connect', () => {
            console.log('Connected to chat socket');
        });

        newSocket.on('newMessage', (message: Message) => {
            setMessages((prev) => {
                if (prev.find(m => m.id === message.id)) {
                    return prev;
                }
                return [...prev, message];
            });
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
    }, [chatId, currentUser?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingUsers]);

    useEffect(() => {
        if (replyingTo) {
            messageInputRef.current?.focus();
        }
    }, [replyingTo]);

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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !uploadedAsset) || !currentUser || !socket) return;

        socket.emit('sendMessage', {
            chatId,
            content: newMessage.trim(),
            replyToMessageId: replyingTo ? replyingTo.id : null,
            assetIds: uploadedAsset ? [uploadedAsset.id] : [],
        }, (savedMessage: Message) => {
            setMessages((prev) => [...prev, savedMessage]);
        });

        socket.emit('stopTyping', { chatId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        setNewMessage("");
        setReplyingTo(null);
        setUploadedAsset(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const { data } = await apiClient.post("/assets", uploadData);
            setUploadedAsset(data);
        } catch (err) {
            console.error("Error uploading file:", err);
            setError("Couldn't upload file.");
        }
    };

    const handleSaveEdit = (messageId: string) => {
        if (!editContent.trim() || !socket) return;
        
        socket.emit('editMessage', {
            messageId,
            content: editContent.trim()
        }, (updatedMessage: Message) => {
            setMessages((prev) =>
                prev.map(msg => msg.id === messageId ? updatedMessage : msg)
            );
        });
        
        setEditingMessageId(null);
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
                    <h1 className="text-lg font-semibold text-neutral-800">{chat?.name || "Chat"}</h1>
                    <div className="w-16 flex justify-end">
                        {chat?.type === 'GROUP' && (
                            <button
                                onClick={() => router.push(`/app/chat/${chatId}/manage`)}
                                className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                Manage
                            </button>
                        )}
                    </div>
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
                            const isEditing = editingMessageId === msg.id;
                            const repliedToMessage = msg.replyToMessageId ? messages.find(m => m.id === msg.replyToMessageId) : null;

                            const messageDate = new Date(msg.createdAt);
                            const isToday = new Date().toDateString() === messageDate.toDateString();
                            const timeString = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const dateString = messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
                            const displayTime = isToday ? timeString : `${dateString}, ${timeString}`;
                            
                            const currentAsset = msg.assets?.length > 0
                                ? msg.assets[0].asset
                                : null;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex w-full group ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[75%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                                        {!isMe && (
                                            <span className="text-xs text-neutral-500 ml-2">{msg.profile?.username || "User"}</span>
                                        )}
                                        {repliedToMessage && (
                                            <div className="bg-neutral-100/60 px-3 py-2 rounded-t-lg border-b border-neutral-200/60 text-xs text-neutral-500 italic w-full">
                                                <p className="truncate">{repliedToMessage.content}</p>
                                            </div>
                                        )}
                                        {currentAsset && (
                                            <div className="relative w-full aspect-square bg-black border-y border-gray-100 flex items-center justify-center overflow-hidden">
                                                {currentAsset.fileType.startsWith('video/') ? (
                                                    <video
                                                        src={currentAsset.filePath}
                                                        className="w-full h-full object-cover"
                                                        controls
                                                        autoPlay
                                                        muted
                                                        loop
                                                    />
                                                ) : (
                                                    <img
                                                        src={currentAsset.filePath}
                                                        alt="Message content"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <div
                                            className={`px-4 py-2.5 text-sm flex flex-col ${
                                                isMe
                                                    ? "bg-black text-white rounded-l-2xl rounded-tr-2xl"
                                                    : "bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-r-2xl rounded-tl-2xl"
                                            } ${repliedToMessage ? (isMe ? 'rounded-br-none' : 'rounded-bl-none') : ''}`}
                                        >
                                            {isEditing ? (
                                                <form 
                                                    onSubmit={(e) => { e.preventDefault(); handleSaveEdit(msg.id); }}
                                                    className="flex flex-col gap-2 min-w-[200px]"
                                                >
                                                    <input 
                                                        type="text"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className={`px-2 py-1 rounded outline-none w-full text-sm ${isMe ? "bg-white/20 text-white placeholder-white/50" : "bg-white text-black"}`}
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-3 justify-end mt-1">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setEditingMessageId(null)} 
                                                            className="text-[11px] opacity-70 hover:opacity-100 transition-opacity"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            type="submit" 
                                                            className="text-[11px] font-semibold hover:opacity-80 transition-opacity"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <span>{msg.content}</span>
                                                    <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? "text-white/70" : "text-neutral-500"} justify-end`}>
                                                        {msg.updatedAt !== msg.createdAt && (
                                                            <span>(edited)</span>
                                                        )}
                                                        <span>{displayTime}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {!isEditing && (
                                            <div className="flex gap-3 items-center">
                                                {isMe && (
                                                    <button 
                                                        onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.content); }}
                                                        className="text-[11px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setReplyingTo(msg)}
                                                    className="text-[11px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {typingUsers.size > 0 && !typingUsers.has(currentUser?.id ?? '') && (
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
                    {uploadedAsset && (
                        <div className="relative w-24 h-24 mb-2 rounded-md overflow-hidden">
                            <img src={uploadedAsset.filePath} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => {
                                    setUploadedAsset(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {replyingTo && (
                        <div className="bg-neutral-100 p-2 rounded-t-md border-b border-neutral-200 text-xs text-neutral-600 flex justify-between items-center mb-2">
                            <p className="truncate">
                                Replying to: <span className="italic">&#34;{replyingTo.content}&#34;</span>
                            </p>
                            <button onClick={() => setReplyingTo(null)} className="ml-2 text-red-500 font-bold text-xs hover:scale-110 transition-transform">✕</button>
                        </div>
                    )}
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-3 relative"
                    >
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 008.484 8.484l.707-.707" />
                            </svg>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <input
                            ref={messageInputRef}
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Message..."
                            className="flex-1 bg-neutral-100 text-neutral-900 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-neutral-300 transition-all placeholder:text-neutral-500"
                        />
                        {(newMessage.trim() || uploadedAsset) && (
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