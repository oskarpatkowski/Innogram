"use client";

import React, { useEffect, useState } from "react";
import { PostData, PostAsset, Asset, ProfileData } from "@/app/components/ProfileComponent";
import { apiClient } from "@/apiClient";

interface Like {
    id: string;
    profileId: string;
    postId: string;
}

interface Comment {
    id: string;
    content: string;
    profileId: string;
    postId: string;
    profile: ProfileData;
}

function CommentComponent({ comment }: { comment: Comment }) {
    return (
        <div className="flex justify-between items-start mb-1 group">
            <div className="pr-4 leading-[18px]">
                <span className="font-semibold cursor-pointer mr-1">{comment.profile.username}</span>
                <span>{comment.content}</span>
            </div>
            <button className="mt-1 flex-shrink-0 text-[#737373] hover:opacity-60">
                <svg aria-label="Like" fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 1.18 1.815 1.18 1.815l.004-.002.004.002s.34-.641 1.18-1.815a4.21 4.21 0 0 1 3.675-1.941" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>
            </button>
        </div>
    )
}

export default function Post(postData: PostData) {
    const { id, content, postAssets } = postData;
    const [userData, setUserData] = useState<ProfileData>();
    const [currentUserData, setCurrentUserData] = useState<ProfileData>();
    const [likes, setLikes] = useState<Like[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [showCopiedPopup, setShowCopiedPopup] = useState(false);
    const [isPopupFadingOut, setIsPopupFadingOut] = useState(false);

    // For media cross-fade
    const [isFading, setIsFading] = useState(false);
    const [nextImageIndex, setNextImageIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const [
                    userDataResponse,
                    likesResponse,
                    commentsResponse,
                    currentUserDataResponse
                ] = await Promise.all([
                    apiClient.get(`profiles/${postData.profileId}`),
                    apiClient.get(`posts/${id}/likes`),
                    apiClient.get(`comments/post/${id}`),
                    apiClient.get('profiles/me')
                ]);
                setUserData(userDataResponse.data);
                setLikes(likesResponse.data);
                setCurrentUserData(currentUserDataResponse.data);
                const commentsWithProfiles = await Promise.all(commentsResponse.data.map(async (comment: Comment) => {
                    const profileResponse = await apiClient.get(`profiles/${comment.profileId}`);
                    return { ...comment, profile: profileResponse.data };
                }));
                setComments(commentsWithProfiles);
            } catch (error) {
                console.error("Failed to fetch post data", error);
            }
        };

        if (postData.profileId && id) {
            fetchPostData();
        }
    }, [postData.profileId, id]);

    useEffect(() => {
        if (isFading && nextImageIndex !== null) {
            const timer = setTimeout(() => {
                setCurrentImageIndex(nextImageIndex);
                setIsFading(false);
                setNextImageIndex(null);
            }, 300); // Wait for the fade-out to finish
            return () => clearTimeout(timer);
        }
    }, [isFading, nextImageIndex]);

    const handleNextImage = () => {
        if (postAssets && postAssets.length > 0 && !isFading) {
            const nextIndex = (currentImageIndex + 1) % postAssets.length;
            setNextImageIndex(nextIndex);
            setIsFading(true); // Start fade-out
        }
    };

    const handlePrevImage = () => {
        if (postAssets && postAssets.length > 0 && !isFading) {
            const nextIndex = (currentImageIndex - 1 + postAssets.length) % postAssets.length;
            setNextImageIndex(nextIndex);
            setIsFading(true); // Start fade-out
        }
    };

    const isLikedByCurrentUser = () => {
        return likes.some((like) => like.profileId === currentUserData?.id)
    }

    const handleLike = async () => {
        try {
            if (isLikedByCurrentUser()) {
                await apiClient.delete(`posts/${id}/like`);
            } else {
                await apiClient.post(`posts/${id}/like`);
            }
            const likesResponse = await apiClient.get(`posts/${id}/likes`);
            setLikes(likesResponse.data);
        } catch {
            console.error('failed to like post')
        }
    }

    const handleCommentsVisible = () => {
        setCommentsVisible(!commentsVisible)
    }

    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/app/posts/${id}`);
        setShowCopiedPopup(true);
        setIsPopupFadingOut(false);
        setTimeout(() => {
            setIsPopupFadingOut(true);
            setTimeout(() => {
                setShowCopiedPopup(false);
                setIsPopupFadingOut(false);
            }, 300); // Wait for fade-out animation to complete
        }, 2000); // Start fade-out after 2 seconds
    }

    const currentAsset = postAssets?.length > 0
        ? postAssets[currentImageIndex].asset
        : null;

    const nextAsset = nextImageIndex !== null && postAssets?.length > 0
        ? postAssets[nextImageIndex].asset
        : null;

    return (
        <div className="max-w-[470px] w-full mx-auto bg-white border-b border-gray-200 pb-2 mb-6 font-sans text-sm text-black relative">

            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full p-[2px]">
                        <div className="w-full h-full bg-white rounded-full border border-white overflow-hidden">
                            {
                                userData?.avatarUrl ? (
                                    <img
                                        src={userData?.avatarUrl}
                                        alt={`${userData?.username || 'User'}'s profile`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-gray-100 border border-gray-200 p-1 flex items-center justify-center">
                                      <span className="text-gray-500 text-4xl sm:text-6xl font-light uppercase">
                                        {userData?.displayName ? userData?.displayName[0] : userData?.username?.[0]}
                                      </span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold cursor-pointer hover:text-gray-500">
                            {userData ? userData.username : "..."}
                        </span>
                        <span className="text-[#737373] ml-1">
                            {new Date(postData.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {currentAsset && (
                <div className="relative w-full aspect-square bg-black border-y border-gray-100 flex items-center justify-center overflow-hidden">

                    {/* Next Asset (Bottom Layer) */}
                    {nextAsset && (
                        <div className="absolute inset-0 z-0">
                            {nextAsset.fileType.startsWith('video/') ? (
                                <video
                                    src={nextAsset.filePath}
                                    className="w-full h-full object-cover"
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                />
                            ) : (
                                <img
                                    src={nextAsset.filePath}
                                    alt="Next Post content"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    )}

                    {/* Current Asset (Top Layer, fading out) */}
                    {/* FIX: Transition duration changes to 0s instantly when isFading is false to prevent flash fade-in */}
                    <div className={`absolute inset-0 z-10 transition-opacity ${isFading ? 'duration-300 opacity-0' : 'duration-0 opacity-100'}`}>
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
                                alt="Post content"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {postAssets && postAssets.length > 1 && (
                        <>
                            <button onClick={handlePrevImage} className="absolute left-2 bg-white/80 hover:bg-white transition-colors rounded-full p-1.5 shadow-sm z-30">
                                <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16"><path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                            </button>
                            <button onClick={handleNextImage} className="absolute right-2 bg-white/80 hover:bg-white transition-colors rounded-full p-1.5 shadow-sm z-30">
                                <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                                {postAssets.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`h-2 w-2 rounded-full transition-colors duration-300 ${(isFading ? nextImageIndex : currentImageIndex) === index ? 'bg-white' : 'bg-white/40'}`}
                                    ></span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="flex justify-between items-center px-3 py-2 mt-1">
                <div className="flex gap-4 items-center">
                    <button
                        className="hover:opacity-60 transition-opacity"
                        onClick={handleLike}
                    >
                        <svg aria-label="Like" height="24" viewBox="0 0 24 24" width="24">
                            <path
                                d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 1.18 1.815 1.18 1.815l.004-.002.004.002s.34-.641 1.18-1.815a4.21 4.21 0 0 1 3.675-1.941"
                                fill={isLikedByCurrentUser() ? "black" : "none"}
                                stroke={isLikedByCurrentUser() ? "black" : "currentColor"}
                                strokeWidth="2"
                            ></path>
                        </svg>
                    </button>
                    <button
                        className="hover:opacity-60 transition-opacity"
                        onClick={handleCommentsVisible}
                    >
                        <svg aria-label="Comment" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                            <path
                                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                                fill={commentsVisible ? "black" : "none"}
                                stroke={commentsVisible ? "black" : "currentColor"}
                                strokeLinejoin="round"
                                strokeWidth="2"
                            ></path>
                        </svg>
                    </button>
                    <button
                        className="hover:opacity-60 transition-opacity"
                        onClick={handleShare}
                    >
                        <svg aria-label="Share" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="px-3 font-semibold mb-1 cursor-pointer">
                {likes.length} likes
            </div>

            <div className="px-3 mb-1">
                {userData && (
                    <span className="font-semibold cursor-pointer mr-2">
                        {userData.username}
                    </span>
                )}
                <span>
                    {content}
                </span>
            </div>

            {comments.length > 0 && (
                <div className="px-3 mb-2">
                    {(commentsVisible ? comments : comments.slice(0, 2)).map((comment) => (
                        <CommentComponent key={comment.id} comment={comment} />
                    ))}
                </div>
            )}

            {/* Add Comment Input */}
            <div className="px-3 flex items-center justify-between mt-3 text-[#737373]">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full outline-none text-sm placeholder-[#737373] text-black"
                />
            </div>

            {/* Copy to clipboard popup */}
            {showCopiedPopup && (
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg ${isPopupFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
                    Link copied to clipboard!
                </div>
            )}
        </div>
    );
}