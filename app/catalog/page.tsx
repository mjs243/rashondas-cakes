"use client";

import { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl: string;
}

export default function CatalogPage() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [clicked, setClicked] = useState<string | null>(null);
    const [modalClicked, setModalClicked] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products");
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();

                // Ensure imageUrl is always a valid string
                const baseUrl = process.env.NEXT_PUBLIC_KEYSTONE_URL ?? "http://localhost:3001";

                const processedProducts = data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    description: p.description,
                    imageUrl: p.productImage?.url
                        ? `${baseUrl}${p.productImage.url}`
                        : "/images/placeholderCake.jpg",
                }));

                console.log("Processed products:", processedProducts);
                setProducts(processedProducts);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    function openModal(product: Product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleAddToCart(product: Product, isModal = false) {
        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
        });

        if (isModal) {
            setModalClicked(product.id);
            setTimeout(() => setModalClicked(null), 600);
        } else {
            setClicked(product.id);
            setTimeout(() => setClicked(null), 600);
        }

        toast.success(`${product.name} added to cart!`, {
            icon: "🛒",
            style: { background: "#FADADD", color: "#6B0F1A" },
        });
    }

    return (
        <section className="max-w-7xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-pink-800 mb-8">Our Catalog</h2>

            {/* Loading & Error Handling */}
            {loading && <p className="text-center text-gray-500">Loading products...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-md shadow-md p-4">
                            <div className="relative w-full h-48 mb-4">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-pink-700">{product.name}</h3>
                            <p className="text-gray-500 mt-1">${(product.price / 100).toFixed(2)}</p>
                            <p className="text-gray-700 mt-2 line-clamp-2">{product.description}</p>

                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => openModal(product)}
                                    className="bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600 transition"
                                >
                                    Details
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition relative"
                                    >
                                        Add to Cart
                                    </button>

                                    {/* Ensure animation only appears in the correct location */}
                                    <AnimatePresence>
                                        {clicked === product.id && !isModalOpen && (
                                            <motion.span
                                                key="cart-anim"
                                                initial={{ scale: 0, y: 0, opacity: 0 }}
                                                animate={{ scale: 4.0, y: -60, opacity: 1, rotate: 360 }}
                                                exit={{ scale: 0, y: 0, opacity: 0 }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                                className="absolute left-1/2 transform -translate-x-1/2"
                                            >
                                                🎂
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Details Modal */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md max-w-md w-full relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            X
                        </button>
                        <h2 className="text-xl font-bold mb-4">{selectedProduct.name}</h2>
                        <Image
                            src={selectedProduct.imageUrl}
                            alt={selectedProduct.name}
                            width={300}
                            height={200}
                            className="rounded-md"
                        />
                        <p className="mt-2 text-gray-700">{selectedProduct.description}</p>
                        <p className="mt-2 text-gray-500">
                            Price: ${(selectedProduct.price / 100).toFixed(2)}
                        </p>
                        <div className="relative mt-4">
                            <button
                                onClick={() => handleAddToCart(selectedProduct, true)}
                                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 relative"
                            >
                                Add to Cart
                                <AnimatePresence>
                                    {modalClicked === selectedProduct.id && (
                                        <motion.span
                                            key="modal-cart-anim"
                                            initial={{ scale: 0, y: 0, opacity: 0 }}
                                            animate={{ scale: 4.0, y: -60, opacity: 1, rotate: 360 }}
                                            exit={{ scale: 0, y: 0, opacity: 0 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="absolute left-1/2 transform -translate-x-1/2"
                                        >
                                            🎂
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
