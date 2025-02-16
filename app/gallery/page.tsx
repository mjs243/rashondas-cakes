"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface InstagramPost {
    id: string;
    media_type: string;
    media_url: string;
    caption?: string;
}

export default function GalleryPage() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInstagramPosts() {
            try {
                const response = await fetch("/api/instagram");
                if (!response.ok) throw new Error("Failed to fetch Instagram posts");
                const data = await response.json();
                setPosts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchInstagramPosts();
    }, []);

    return (
        <section className="max-w-7xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Our Cake Creations</h2>

            {/* Loading & Error Handling */}
            {loading && <p className="text-center text-gray-500">Loading Instagram feed...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="relative group overflow-hidden rounded-md shadow-md">
                            <Image
                                src={post.media_url}
                                alt={post.caption ?? "Instagram post"}
                                width={400}
                                height={400}
                                className="w-full h-auto object-cover transition-transform transform group-hover:scale-105"
                            />
                            {post.caption && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                                    <p className="text-sm">{post.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
