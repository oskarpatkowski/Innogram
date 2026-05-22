'use client';

import {UserProfile} from "@/app/components/ProfileComponent";
import {useEffect, useState} from "react";
import {apiClient} from "@/apiClient";
import {useParams} from "next/navigation";

export default function ProfilePage() {
    const [profileId, setProfileId] = useState("")
    const [error, setError] = useState("")

    const params = useParams();
    const username = params.username as string;

    useEffect(() => {
        const fetchProfileId = async () => {
            try {
                const { data } = await apiClient.get(`/profiles/username/${username}`);
                setProfileId(data)
                console.log(data)

            } catch {
                setError("couldn't fetch profile")
            }
        }
        fetchProfileId()
    }, [username]);

    return (
        error ? <div>{error}</div> :
        <UserProfile profileId={profileId}></UserProfile>
    );
}
