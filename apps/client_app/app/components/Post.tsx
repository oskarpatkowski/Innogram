"use client";

import React, { useEffect, useState } from "react";
import { PostData, PostAsset, Asset, ProfileData } from "@/app/components/ProfileComponent";
import { apiClient } from "@/apiClient";
import {comment} from "postcss";

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
    likes: Like[];
    parentCommentId?: string;
    replies?: Comment[];
}

interface CommentComponentProps {
    comment: Comment;
    onCommentLike: (commentId: string) => void;
    onReply: (parentCommentId: string, content: string) => void;
    currentUserProfileId?: string;
    onCommentDeleted: () => void;
    onCommentUpdated: () => void;
}

const parseContentForMentions = (content: string) => {
    const mentionRegex = /@([a-zA-Z0-9_.-]+)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    content.replace(mentionRegex, (match, username, offset) => {
        if (offset > lastIndex) {
            parts.push(content.substring(lastIndex, offset));
        }

        parts.push(
            <span
                key={offset}
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/app/profile/${username}`;
                }}
            >
                {match}
            </span>
        );

        lastIndex = offset + match.length;
        return match;
    });

    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
    }

    return parts;
};

function CommentComponent({ comment, onCommentLike, onReply, currentUserProfileId, onCommentDeleted, onCommentUpdated }: CommentComponentProps) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    let isLikedByCurrentUser = false;
    if(comment.likes){
        isLikedByCurrentUser = comment.likes.some(like => like.profileId === currentUserProfileId);
    }

    const handleDelete = async () => {
        try {
            await apiClient.delete(`comments/${comment.id}`);
            onCommentDeleted();
        } catch  {
            setError("couldn't delete comment")
        }
    }

    const handleEdit = async () => {
        try {
            await apiClient.put(`comments/${comment.id}`, { content: editedContent });
            setIsEditing(false);
            onCommentUpdated();
        } catch  {
            setError("couldn't update comment")
        }
    }

    const handleReplySubmit = () => {
        if (replyContent.trim()) {
            onReply(replyContent, comment.id);
            setReplyContent("");
            setShowReplyInput(false);
        }
    };

    const isCommentCreator = currentUserProfileId === comment.profileId;

    return (
        <div className="mb-2">
            <div className="flex justify-between items-start group">
                <div className="pr-4 leading-[18px]">
                    <span className="font-semibold cursor-pointer mr-1">{comment.profile.username}</span>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full outline-none text-sm placeholder-[#737373] text-black border-b border-gray-200 focus:border-gray-400"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleEdit();
                                }
                            }}
                        />
                    ) : (
                        <span>{parseContentForMentions(comment.content)}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {comment.likes.length > 0 && (
                        <span className="text-xs text-gray-500">{comment.likes.length}</span>
                    )}
                    <button
                        onClick={() => onCommentLike(comment.id)}
                        className="mt-1 flex-shrink-0 text-[#737373] hover:opacity-60"
                    >
                        <svg aria-label="Like" fill={isLikedByCurrentUser ? "black" : "currentColor"} height="12" viewBox="0 0 24 24" width="12">
                            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 1.18 1.815 1.18 1.815l.004-.002.004.002s.34-.641 1.18-1.815a4.21 4.21 0 0 1 3.675-1.941" fill={isLikedByCurrentUser ? "black" : "none"} stroke="currentColor" strokeWidth="2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-1 ml-1">
                <button
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    className="text-xs text-gray-500 hover:underline"
                >
                    {showReplyInput ? "Cancel" : "Reply"}
                </button>
                {isCommentCreator && (
                    <>
                        {isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="text-xs text-blue-500 hover:underline"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-xs text-gray-500 hover:underline"
                            >
                                Edit
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
            {showReplyInput && (
                <div className="flex items-center mt-2 ml-4">
                    <input
                        type="text"
                        placeholder={`Reply to ${comment.profile.username}...`}
                        className="w-full outline-none text-sm placeholder-[#737373] text-black border-b border-gray-200 focus:border-gray-400"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleReplySubmit();
                            }
                        }}
                    />
                    <button
                        onClick={handleReplySubmit}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        Post
                    </button>
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-xs text-gray-500 hover:underline ml-1"
                    >
                        {showReplies ? `Hide ${comment.replies.length} replies` : `View ${comment.replies.length} replies`}
                    </button>
                    {showReplies && (
                        <div className="mt-2 ml-4 border-l pl-2">
                            {comment.replies.map((reply) => (
                                <CommentComponent
                                    key={reply.id}
                                    comment={reply}
                                    onCommentLike={onCommentLike}
                                    onReply={onReply}
                                    currentUserProfileId={currentUserProfileId}
                                    onCommentDeleted={onCommentDeleted}
                                    onCommentUpdated={onCommentUpdated}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
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
    const [newComment, setNewComment] = useState("");
    const [commentError, setCommentError] = useState("");

    const [isFading, setIsFading] = useState(false);
    const [nextImageIndex, setNextImageIndex] = useState<number | null>(null);

    const fetchComments = async () => {
        try {
            const commentsResponse = await apiClient.get(`comments/post/${id}`);
            const fetchedComments: Comment[] = await Promise.all(commentsResponse.data.map(async (comment: Comment) => {
                const [profileResponse, likesResponse] = await Promise.all([
                    apiClient.get(`profiles/${comment.profileId}`),
                    apiClient.get(`comments/${comment.id}/likes`) // Fetch likes for each comment
                ]);
                return { ...comment, profile: profileResponse.data, likes: likesResponse.data };
            }));

            const commentsById: { [key: string]: Comment } = {};
            fetchedComments.forEach(comment => {
                commentsById[comment.id] = { ...comment, replies: [] }; // Initialize replies array
            });

            const rootComments: Comment[] = [];
            fetchedComments.forEach(comment => {
                if (comment.parentCommentId && commentsById[comment.parentCommentId]) {
                    commentsById[comment.parentCommentId].replies?.push(commentsById[comment.id]);
                } else {
                    rootComments.push(commentsById[comment.id]);
                }
            });

            rootComments.forEach(comment => {
                comment.replies?.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime()); // Assuming ID can be used for sorting, or add createdAt to Comment interface
            });

            setComments(rootComments);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const [
                    userDataResponse,
                    likesResponse,
                    currentUserDataResponse
                ] = await Promise.all([
                    apiClient.get(`profiles/${postData.profileId}`),
                    apiClient.get(`posts/${id}/likes`),
                    apiClient.get('profiles/me')
                ]);
                setUserData(userDataResponse.data);
                setLikes(likesResponse.data);
                setCurrentUserData(currentUserDataResponse.data);
                await fetchComments(); // Fetch comments after initial data
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

    const handleUsernameClick = () => {
        if (userData) {
            window.location.href = `/app/profile/${userData.username}`
        }
    }

    const currentAsset = postAssets?.length > 0
        ? postAssets[currentImageIndex].asset
        : null;

    const nextAsset = nextImageIndex !== null && postAssets?.length > 0
        ? postAssets[nextImageIndex].asset
        : null;

    const handleCommentAdd = async (commentContent: string, parentCommentId?: string) => {
        if (!commentContent.trim()) {
            setCommentError("Comment cannot be empty.");
            return;
        }
        try {
            const payload = parentCommentId ? {
                content: commentContent,
                postId: id,
                parentCommentId: parentCommentId,
            } : {
                content: commentContent,
                postId: id,
            };

            await apiClient.post('comments', payload);
            setNewComment('');
            setCommentError('');
            await fetchComments(); // Re-fetch comments to show the new one
        } catch (error) {
            console.error("Failed to add comment", error);
            setCommentError('Failed to add comment');
        }
    }

    const handleCommentLike = async (commentId: string) => {
        try {

            const findCommentInTree = (commentsArray: Comment[], commentId: string): Comment | undefined => {
                for (const comment of commentsArray) {
                    if (comment.id === commentId) {
                        return comment;
                    }
                    if (comment.replies && comment.replies.length > 0) {
                        const found = findCommentInTree(comment.replies, commentId);
                        if (found) return found;
                    }
                }
                return undefined;
            };

            const commentToLike = findCommentInTree(comments, commentId);
            const hasLiked = commentToLike?.likes.some(like => like.profileId === currentUserData?.id);

            if (hasLiked) {
                await apiClient.delete(`comments/${commentId}/like`);
            } else {
                await apiClient.post(`comments/${commentId}/like`);
            }
            await fetchComments(); // Re-fetch comments to update like counts and status
        } catch (error) {
            console.error("Failed to like comment", error);
            setCommentError("Couldn't like comment");
        }
    }

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
                        <span
                            className="font-semibold cursor-pointer hover:text-gray-500"
                            onClick={handleUsernameClick}
                        >
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
            <span className="text-gray-500 text-s ml-2 italic">{postData.isArchived ? "Archived" : ""}</span>
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
                        <div className="flex">
                            <svg aria-label="Comment" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                                <path
                                    d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                                    fill={commentsVisible ? "black" : "none"}
                                    stroke={commentsVisible ? "black" : "currentColor"}
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                ></path>
                            </svg>
                            <span className="ml-2 text-gray-700 font-semibold">{comments.length}</span>
                        </div>
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
                    {parseContentForMentions(content)}
                </span>
            </div>

            {comments.length > 0 && (
                <div className="px-3 mb-2">
                    {(commentsVisible ? comments : comments.slice(0, 2)).map((comment) => (
                        <CommentComponent
                            key={comment.id}
                            comment={comment}
                            onCommentLike={handleCommentLike}
                            onReply={handleCommentAdd}
                            currentUserProfileId={currentUserData?.id}
                            onCommentDeleted={fetchComments}
                            onCommentUpdated={fetchComments}
                        />
                    ))}
                </div>
            )}

            <div className="px-3 flex items-center justify-between mt-3 text-[#737373]">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full outline-none text-sm placeholder-[#737373] text-black"
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleCommentAdd(newComment);
                        }
                    }}
                />
                <button
                    onClick={() => handleCommentAdd(newComment)}
                    className="ml-2 px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-700"
                    disabled={!newComment.trim()}
                >
                    Post
                </button>
            </div>
            {commentError && <p className="text-red-500 text-xs px-3 mt-1">{commentError}</p>}


            {showCopiedPopup && (
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg ${isPopupFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
                    Link copied to clipboard!
                </div>
            )}
        </div>
    );
}