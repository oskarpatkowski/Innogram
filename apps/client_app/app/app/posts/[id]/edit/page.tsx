"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/apiClient";

interface MediaAsset {
    file?: File;
    url: string;
    type: string;
    id?: string;
}

interface Asset {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    createdById: string,
    updatedById: string | null,
    orderIndex: number,
    fileName: string,
    filePath: string,
    fileType: string,
    fileSize: number
}

interface PostAsset {
    asset: Asset
    post: never
    id: never
}

export default function EditPost() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [content, setContent] = useState("");
    const [media, setMedia] = useState<MediaAsset[]>([]);
    const [error, setError] = useState("");
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                if (id) {
                    const { data } = await apiClient.get(`posts/${id}`);
                    setContent(data.content || "");
                    
                    if (data.postAssets && Array.isArray(data.postAssets)) {
                        const initialMedia = data.postAssets.map((pa: PostAsset) => ({
                            url: pa.asset.filePath,
                            type: pa.asset.fileType,
                            id: pa.asset.id
                        }));
                        setMedia(initialMedia);
                    }
                }
            } catch (err) {
                console.error(`Couldn't fetch post ${id}`, err);
                setError("Failed to load post data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPostData();
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                url: URL.createObjectURL(file),
                type: file.type
            }));
            setMedia(prevMedia => [...prevMedia, ...newFiles]);
        }
    };

    const handleNextMedia = () => {
        if (media.length > 1) {
            setCurrentMediaIndex((prev) => (prev + 1) % media.length);
        }
    };

    const handlePrevMedia = () => {
        if (media.length > 1) {
            setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
        }
    };

    const handleRemoveMedia = () => {
        const removedAsset = media[currentMediaIndex];
        if (removedAsset.file) {
            URL.revokeObjectURL(removedAsset.url);
        }

        setMedia(prevMedia => prevMedia.filter((_, index) => index !== currentMediaIndex));
        if (currentMediaIndex >= media.length - 1) {
            setCurrentMediaIndex(Math.max(0, media.length - 2));
        }
    };

    const handleSubmit = async () => {
        const mediaIds = [];

        for (const asset of media) {
            if (asset.id) {
                mediaIds.push(asset.id);
            } else if (asset.file) {
                try {
                    const uploadData = new FormData();
                    uploadData.append("file", asset.file);
                    const { data } = await apiClient.post("/assets", uploadData);
                    mediaIds.push(data.id);
                } catch {
                    setError("Error processing new media assets");
                    return;
                }
            }
        }

        try {
            await apiClient.put(`/posts/${id}`, {
                content: content,
                assetIds: mediaIds
            });
            router.push(`/app/posts/${id}`);
        } catch {
            setError("Error updating the post");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border border-neutral-300 rounded-md shadow-sm overflow-hidden">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <div className="w-full aspect-square bg-neutral-50 relative border-b border-neutral-200">
                    {media.length === 0 ? (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors group">
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="text-neutral-400 group-hover:text-neutral-600 transition-colors">
                                <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">Click to select media</span>
                            </div>
                        </label>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">

                            {media.map((asset, index) => (
                                <div
                                    key={asset.url + index}
                                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                                        index === currentMediaIndex
                                            ? 'opacity-100 z-10'
                                            : 'opacity-0 z-0 pointer-events-none'
                                    }`}
                                >
                                    {asset.type.startsWith('video/') ? (
                                        <video src={asset.url} className="h-full w-full object-contain" controls autoPlay muted loop />
                                    ) : (
                                        <img src={asset.url} alt={`Media ${index}`} className="h-full w-full object-contain" />
                                    )}
                                </div>
                            ))}

                            {media.length > 1 && (
                                <>
                                    <button onClick={handlePrevMedia} className="absolute left-2 bg-white/80 rounded-full p-1.5 shadow-sm z-20">
                                        <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16"><path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                                    </button>
                                    <button onClick={handleNextMedia} className="absolute right-2 bg-white/80 rounded-full p-1.5 shadow-sm z-20">
                                        <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                        {media.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                                                    currentMediaIndex === index ? 'bg-white' : 'bg-gray-400'
                                                }`}
                                            ></span>
                                        ))}
                                    </div>
                                </>
                            )}
                            <label className="absolute top-2 right-12 bg-white/80 rounded-full p-1.5 shadow-sm z-20 cursor-pointer hover:bg-white transition-colors">
                                <input type="file" multiple className="hidden" onChange={handleFileChange} />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </label>
                            <button onClick={handleRemoveMedia} className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 shadow-sm z-20 hover:bg-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col gap-4">
                    <textarea
                        placeholder="Write a caption..."
                        className="w-full resize-none outline-none text-neutral-800 placeholder-neutral-400 bg-transparent"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={3}
                    ></textarea>
                    <button
                        className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded transition-colors duration-200 cursor-pointer disabled:bg-neutral-400"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}