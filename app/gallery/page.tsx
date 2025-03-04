"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  altText?: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
}

interface Gallery {
  id: string;
  name: string;
  description?: string;
  images: GalleryImage[];
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_KEYSTONE_URL ?? "http://localhost:3001";

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch("/api/gallery?name=Cake Gallery");
        if (!response.ok) throw new Error("Failed to fetch gallery");
        const data = await response.json();
        setGallery(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Function to get complete image URL
  const getImageUrl = (url: string) => {
    // If URL already starts with http/https, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Otherwise, prepend the base URL
    return `${baseUrl}${url}`;
  };

  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Our Cake Creations</h2>
      
      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-500">Loading gallery...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && gallery && (
        <>
          {gallery.description && (
            <p className="text-center text-gray-700 mb-8">{gallery.description}</p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.images.map((image) => (
              <div key={image.id} className="relative group overflow-hidden rounded-md shadow-md">
                <Image
                  src={getImageUrl(image.image.url)}
                  alt={image.altText || "Gallery image"}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover transition-transform transform group-hover:scale-105"
                />
                {image.altText && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                    <p className="text-sm">{image.altText}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      {!loading && !error && (!gallery || gallery.images.length === 0) && (
        <p className="text-center text-gray-500">No images found in the gallery.</p>
      )}
    </section>
  );
}