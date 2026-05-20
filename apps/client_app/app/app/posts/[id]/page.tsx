'use client';

import { useParams } from "next/navigation";
import {PostData} from "@/app/components/ProfileComponent";
import {useEffect, useState} from "react";
import {apiClient} from "@/apiClient";
import Post from "@/app/components/Post";
import {useAppContext} from "@/app/state/AppContext";

export default function PostPage() {
    const params = useParams();
    const id = params.id as string;
    const [postData, setPostData] = useState<PostData>({
        id: "",
        profileId: "",
        content: "",
        isArchived: false,
        createdAt: new Date(0),
        createdById: "",
        postAssets: [],
        updatedAt: new Date(0),
        updatedById: ""
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { state } = useAppContext()

    useEffect(() => {
        const fetchPostData = async () => {
            try{
                if (id) {
                    const { data } = await apiClient.get(`posts/${id}`)
                    setPostData(data)
                }
            } catch {
                console.error(`Couldn't fetch post ${id}`)
            }
        }
        fetchPostData()
    }, [id]);

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/posts/${id}`)
            window.location.href = "/app/profile/me"
        } catch {}
    }

    const handleEdit = async () => {
        window.location.href = `/app/posts/${id}/edit`
    }

    return (
        <div className="flex flex-col items-center justify-center">
            {postData.id ? <Post {...postData}></Post> : null}
            {
                postData.profileId == state.user?.accountId ? (
                    <div>
                        <button
                            className="bg-red-800 text-white rounded-md m-2 p-2 hover:bg-red-900 transition-all hover:cursor-pointer text-sm font-semibold"
                            onClick={() => setShowDeleteConfirm(true)}
                        >Delete Post
                        </button>
                        <button
                            className="bg-black text-white rounded-md m-2 p-2 hover:bg-gray-800 transition-all hover:cursor-pointer text-sm font-semibold"
                            onClick={handleEdit}
                        >
                            Edit Post
                        </button>
                    </div>
                ) : <></>
            }
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        <h3 className="text-lg font-medium mb-4">Are you sure you want to delete this post?</h3>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}