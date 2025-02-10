"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "./components/CartContext";

interface Cake {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    isFeatured: boolean;
}

export default function HomeClient({ featuredCakes }: { featuredCakes: Cake[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

    const { addToCart } = useCart();

    function openModal(cake: Cake) {
        setSelectedCake(cake);
        setIsModalOpen(true);
    }

    function handleAddToCart() {
        if (!selectedCake) return;
        addToCart({
            productId: selectedCake.id,
            name: selectedCake.name,
            price: selectedCake.price,
            imageUrl: selectedCake.imageUrl,
        });
        setIsModalOpen(false);
    }

    return (
        <section className="max-w-7xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-pink-800 mb-8">Featured Cakes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCakes.map((cake) => (
                    <div
                        key={cake.id}
                        className="bg-white rounded-md shadow-md p-4 hover:shadow-lg transition"
                    >
                        <div className="relative w-full h-48 mb-4">
                            <Image
                                src={cake.imageUrl}
                                alt={cake.name}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-pink-700">{cake.name}</h3>
                        <p className="text-gray-500 mt-1">${(cake.price / 100).toFixed(2)}</p>
                        <p className="text-gray-700 mt-2 line-clamp-2">{cake.description}</p>
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => openModal(cake)}
                                className="bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600 transition"
                            >
                                Details
                            </button>
                            <button
                                onClick={() =>
                                    addToCart({
                                        productId: cake.id,
                                        name: cake.name,
                                        price: cake.price,
                                        imageUrl: cake.imageUrl,
                                    })
                                }
                                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cake Details Modal */}
            {isModalOpen && selectedCake && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md max-w-md w-full relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-400  hover:text-gray-600"
                        >
                            X
                        </button>
                        <h2 className="text-xl font-bold mb-4">{selectedCake.name}</h2>
                        <Image
                            src={selectedCake.imageUrl}
                            alt={selectedCake.name}
                            width={300}
                            height={200}
                            className="rounded-md"
                        />
                        <p className="mt-2 text-gray-700">{selectedCake.description}</p>
                        <p className="mt-2 text-gray-500">Price: ${(selectedCake.price / 100).toFixed(2)}</p>
                        <button
                            onClick={handleAddToCart}
                            className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}