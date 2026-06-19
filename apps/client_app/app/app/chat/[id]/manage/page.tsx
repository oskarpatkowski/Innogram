'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/apiClient';
import { ProfileData } from '@/app/components/ProfileComponent';
import {ChatType, ChatParticipant} from "@/app/app/chat/page";


interface Chat {
  id: string;
  name: string;
  description: string;
  type: ChatType;
  createdById: string;
  participants: ChatParticipant[];
}

export default function ManageChatPage() {
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<ProfileData | null>(null);
  const [isAddMemberMode, setIsAddMemberMode] = useState(false);
  const [following, setFollowing] = useState<ProfileData[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: user } = await apiClient.get<ProfileData>('/profiles/me');
        
        const { data: chatData } = await apiClient.get(`/chats/${chatId}`);
        setChat(chatData);

        const currentUserProfile = chatData.participants.find((p: { profile: { id: string; }; }) => p.profile.id === user.id)?.profile;
        setCurrentUser(currentUserProfile || user);

        const { data: followingData } = await apiClient.get('/profiles/following');
        setFollowing(followingData);

      } catch (err) {
        console.error(err);
        setError("Couldn't fetch initial data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [chatId]);
  
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

  const handleRemoveParticipant = async (profileId: string) => {
    try {
      const newMembers = chat?.participants.filter((e) => {
        return e.profile.id !== profileId;
      })

      if(!newMembers) {
        return;
      }

      const payload = {
        memberProfileIds: newMembers.map((p) => p.profile.id),
      }

      await apiClient.put(`/chats/${chatId}`, payload);

      setChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          participants: newMembers
        };
      });
    } catch (err) {
      console.error(err);
      setError('Failed to remove participant.');
    }
  };

  const handleAddMembers = async () => {
    try {
      const newMembers = chat?.participants.map(
          (e) => {
            return e.profile.id
          }
      );

      if (!newMembers) {
        return
      }

      selectedMembers.forEach((member) => {
        if(!newMembers.includes(member)){
          newMembers?.push(member)
        }
      })

      const payload = {
        memberProfileIds: newMembers
      }
      await apiClient.put(`/chats/${chatId}`, payload);

      const { data: chatData } = await apiClient.get(`/chats/${chatId}`);
      setChat(chatData);
      setIsAddMemberMode(false);
      setSelectedMembers([]);
    } catch (err) {
      console.error(err);
      setError('Failed to add members.');
    }
  };
  
  const handleMemberSelection = (profileId: string) => {
    setSelectedMembers(prev =>
        prev.includes(profileId)
            ? prev.filter(id => id !== profileId)
            : [...prev, profileId]
    );
};

  const isOwner = chat?.createdById === currentUser?.userId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <p className="text-neutral-500 font-medium">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!chat) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white border border-neutral-300 rounded-md shadow-sm">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <button
                    onClick={() => isAddMemberMode ? setIsAddMemberMode(false) : router.back()}
                    className="text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium text-sm">Back</span>
                </button>
                <h1 className="text-lg font-semibold text-neutral-800">
                    {isAddMemberMode ? 'Add Members' : `Manage ${chat.name}`}
                </h1>
                <div className="w-12"></div>
            </div>

            {isAddMemberMode ? (
                <div className="p-4">
                    <div className="relative w-full" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full text-left resize-none outline-none text-neutral-800 placeholder-neutral-400 bg-transparent border-b border-neutral-300 py-2"
                        >
                            {following.filter(p => selectedMembers.includes(p.id)).map(p => p.username).join(', ') || 'Select Users'}
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
                                            type="checkbox"
                                            name="members"
                                            readOnly
                                            checked={selectedMembers.includes(profile.id)}
                                            className="mr-3"
                                        />
                                        <span>{profile.username}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleAddMembers}
                        className="w-full mt-4 bg-black hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded transition-colors duration-200 cursor-pointer"
                    >
                        Add Selected Members
                    </button>
                </div>
            ) : (
                <>
                    <div className="p-4">
                        <h2 className="text-md font-semibold mb-2">Participants</h2>
                        <ul className="space-y-2">
                            {chat.participants.map((participant) => (
                                <li
                                    key={participant.profile.id}
                                    className="flex items-center justify-between p-2 bg-neutral-50 rounded-md"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{participant.profile.username}</span>
                                    </div>
                                    {isOwner && participant.profile.id !== currentUser?.id && (
                                        <button
                                            onClick={() => handleRemoveParticipant(participant.profile.id)}
                                            className="text-red-500 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {isOwner && (
                        <div className="p-4 border-t border-neutral-200">
                            <button
                                onClick={() => setIsAddMemberMode(true)}
                                className="w-full bg-black hover:bg-gray-700 text-white font-medium py-3 px-4 rounded transition-colors duration-200 cursor-pointer"
                            >
                                Add Member
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
  );
}
