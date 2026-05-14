"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { apiClient } from "@/apiClient";

export interface ProfileData {
    id: string;
    username: string;
    displayName: string;
    birthday: Date;
    bio: string;
    avatarUrl: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    userId: string;
    createdById: string;
    updatedById: string | null;
}

export default function EditProfile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        displayName: "",
        bio: "",
        birthday: "",
        isPublic: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const { data: profileData } = await apiClient.get("/profiles/me");
                setProfile(profileData);

                const formattedDate = profileData.birthday
                    ? new Date(profileData.birthday).toISOString().split("T")[0]
                    : "";

                setFormData({
                    username: profileData.username || "",
                    displayName: profileData.displayName || "",
                    bio: profileData.bio || "",
                    birthday: formattedDate,
                    isPublic: profileData.isPublic,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Username Validation
        if (!formData.username.trim()) {
            newErrors.username = "Username is required.";
        } else if (formData.username.length > 30) {
            newErrors.username = "Username must be 30 characters or fewer.";
        } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.username)) {
            newErrors.username = "Usernames can only use letters, numbers, underscores and periods.";
        }

        // Display Name Validation
        if (formData.displayName.length > 50) {
            newErrors.displayName = "Name must be 50 characters or fewer.";
        }

        // Bio Validation (Now Required)
        if (!formData.bio.trim()) {
            newErrors.bio = "Bio is required.";
        } else if (formData.bio.length > 150) {
            newErrors.bio = "Bio must be 150 characters or fewer.";
        }

        // Birthday Validation
        if (formData.birthday) {
            const selectedDate = new Date(formData.birthday);
            const today = new Date();
            if (selectedDate > today) {
                newErrors.birthday = "Birthday cannot be in the future.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        setSaveMessage("");

        try {
            // Put request using the form data
            await apiClient.put(`/profiles/${profile.id}`, formData);
            setSaveMessage("Profile saved successfully.");

            setTimeout(() => setSaveMessage(""), 3000);
        } catch (e) {
            console.error(e);
            setSaveMessage("Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!profile || !file) return;

        setIsUploadingPhoto(true);
        setSaveMessage("");

        try {
            const objectUrl = URL.createObjectURL(file);
            setProfile({ ...profile, avatarUrl: objectUrl });

            const uploadData = new FormData();
            uploadData.append("file", file); // Must match what FileUploadInterceptor expects

            const { data } = await apiClient.post("/assets", uploadData);

            if (data.filePath) {
                const newAvatarUrl = data.filePath;

                setProfile({ ...profile, avatarUrl: newAvatarUrl });

                await apiClient.put(`/profiles/${profile.id}`, {
                    ...formData,
                    avatarUrl: newAvatarUrl
                });
            }

            setSaveMessage("Profile picture updated!");
            setTimeout(() => setSaveMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setSaveMessage("Failed to upload picture.");

            // Revert on failure
            setProfile({ ...profile });
        } finally {
            setIsUploadingPhoto(false);
            // Clear the file input so the same file can be selected again if needed
            e.target.value = '';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center mt-10 text-gray-500">Profile not found.</div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 md:p-8 sm:mt-8 bg-white sm:border sm:border-gray-200 rounded-lg">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Edit Profile
            </h1>

            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-8">
                {profile.avatarUrl ? (
                    <img
                        src={profile.avatarUrl}
                        alt="Profile Avatar"
                        className={`w-14 h-14 rounded-full object-cover border border-gray-200 transition-opacity ${isUploadingPhoto ? "opacity-50" : "opacity-100"}`}
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium uppercase">
                        {profile.displayName ? profile.displayName[0] : profile.username[0]}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                        {formData.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {formData.displayName}
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <input
                        type="file"
                        id="avatarUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhoto}
                        disabled={isUploadingPhoto}
                    />
                    <label
                        htmlFor="avatarUpload"
                        className={`bg-[#0095F6] hover:bg-[#1877F2] text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shrink-0 cursor-pointer ${isUploadingPhoto ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isUploadingPhoto ? "Uploading..." : "Change photo"}
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                    <label
                        htmlFor="username"
                        className="sm:w-1/4 sm:text-right font-semibold text-gray-900 text-sm sm:mt-2.5"
                    >
                        Username
                    </label>
                    <div className="sm:w-3/4">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm outline-none transition-shadow ${
                                errors.username ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.username && (
                            <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                    <label
                        htmlFor="displayName"
                        className="sm:w-1/4 sm:text-right font-semibold text-gray-900 text-sm sm:mt-2.5"
                    >
                        Name
                    </label>
                    <div className="sm:w-3/4">
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="Name"
                            className={`w-full p-2 border rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm outline-none transition-shadow ${
                                errors.displayName ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.displayName && (
                            <p className="text-xs text-red-500 mt-1">{errors.displayName}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                    <label
                        htmlFor="bio"
                        className="sm:w-1/4 sm:text-right font-semibold text-gray-900 text-sm sm:mt-2.5"
                    >
                        Bio
                    </label>
                    <div className="sm:w-3/4">
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full p-2 border rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm outline-none transition-shadow resize-y ${
                                errors.bio ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <div className="flex justify-between items-start mt-1">
                            <span className="text-xs text-red-500">{errors.bio}</span>
                            <span className={`text-xs ${formData.bio.length > 150 ? "text-red-500 font-semibold" : "text-gray-500"}`}>
                                {formData.bio.length} / 150
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                    <label
                        htmlFor="birthday"
                        className="sm:w-1/4 sm:text-right font-semibold text-gray-900 text-sm sm:mt-2.5"
                    >
                        Birthday
                    </label>
                    <div className="sm:w-3/4">
                        <input
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm outline-none transition-shadow text-gray-900 ${
                                errors.birthday ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.birthday && (
                            <p className="text-xs text-red-500 mt-1">{errors.birthday}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div className="sm:w-1/4 sm:text-right font-semibold text-gray-900 text-sm">
                        Account Privacy
                    </div>
                    <div className="sm:w-3/4 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublic"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label
                            htmlFor="isPublic"
                            className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                            Public Account
                        </label>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
                    <div className="hidden sm:block sm:w-1/4"></div>
                    <div className="w-full sm:w-3/4 flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[#0095F6] hover:bg-[#1877F2] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Saving..." : "Submit"}
                        </button>

                        {saveMessage && (
                            <span
                                className={`text-sm font-medium ${
                                    saveMessage.includes("success") || saveMessage.includes("updated")
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {saveMessage}
                            </span>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}