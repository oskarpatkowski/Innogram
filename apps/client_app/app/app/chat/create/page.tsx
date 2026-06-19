'use client';

import { useState, useEffect, FormEventHandler, useRef } from 'react';
import { apiClient } from "@/apiClient";
import { useRouter } from 'next/navigation';
import { ProfileData } from "@/app/components/ProfileComponent";

enum Type {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP'
}

export default function CreateChat() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<Type>(Type.PRIVATE);
    const [memberProfileIds, setMemberProfileIds] = useState<string[]>([]);
    const [following, setFollowing] = useState<ProfileData[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const { data } = await apiClient.get('/profiles/following');
                setFollowing(data);
            } catch (error) {
                console.error("Couldn't fetch following list", error);
            }
        };
        fetchFollowing();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleMemberSelection = (profileId: string) => {
        if (type === Type.PRIVATE) {
            setMemberProfileIds([profileId]);
            setIsDropdownOpen(false); // Close dropdown after selection for private chat
        } else {
            setMemberProfileIds(prev =>
                prev.includes(profileId)
                    ? prev.filter(id => id !== profileId)
                    : [...prev, profileId]
            );
        }
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const chatData = {
            name,
            description,
            type,
            memberProfileIds,
        };

        try {
            const { data } = await apiClient.post('/chats', chatData);
            console.log('Chat created successfully', data);
            router.push('/app/chat');
        } catch (error) {
            console.error('An error occurred while creating chat:', error);
        }
    };

    const selectedUsernames = following
        .filter(p => memberProfileIds.includes(p.id))
        .map(p => p.username)
        .join(', ');

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border border-neutral-300 rounded-md shadow-sm">
                <div className="p-4 border-b border-neutral-200">
                    <h1 className="text-lg font-semibold text-neutral-800 text-center">Create a new Chat</h1>
                </div>
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <input
                        placeholder="Chat Name"
                        id="name"
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full resize-none outline-none text-neutral-800 placeholder-neutral-400 bg-transparent"
                    />
                    <textarea
                        placeholder="Description"
                        id="description"
                        name="description"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full resize-none outline-none text-neutral-800 placeholder-neutral-400 bg-transparent"
                        rows={3}
                    />
                    <select
                        id="type"
                        name="type"
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value as Type);
                            setMemberProfileIds([]);
                        }}
                        className="w-full resize-none outline-none text-neutral-800 placeholder-neutral-400 bg-transparent"
                    >
                        <option value={Type.PRIVATE}>Private</option>
                        <option value={Type.GROUP}>Group</option>
                    </select>

                    <div className="relative w-full" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full text-left resize-none outline-none text-neutral-800 placeholder-neutral-400 bg-transparent border-b border-neutral-300 py-2"
                        >
                            {selectedUsernames || `Select User${type === Type.GROUP ? 's' : ''}`}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute z-10 -left-4 -right-4 mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
                                {following.map((profile) => (
                                    <div
                                        key={profile.id}
                                        className="flex items-center p-3 hover:bg-neutral-100 cursor-pointer"
                                        onClick={() => handleMemberSelection(profile.id)}
                                    >
                                        <input
                                            type={type === Type.GROUP ? "checkbox" : "radio"}
                                            name="members"
                                            readOnly
                                            checked={memberProfileIds.includes(profile.id)}
                                            className="mr-3"
                                        />
                                        <span>{profile.username}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded transition-colors duration-200 cursor-pointer"
                    >
                        Create Chat
                    </button>
                </form>
            </div>
        </div>
    );
}
