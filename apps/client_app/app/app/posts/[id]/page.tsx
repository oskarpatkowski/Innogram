'use client';

import { useParams } from "next/navigation";
import {PostData} from "@/app/components/ProfileComponent";
import {useEffect, useState} from "react";
import {apiClient} from "@/apiClient";
import Post from "@/app/components/Post";

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

    return (
        <div>
            {postData.id ? <Post {...postData}></Post> : null}
        </div>
    );
}