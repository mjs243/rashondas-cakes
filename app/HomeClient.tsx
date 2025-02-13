"use client";

import { useCart } from "./components/CartContext";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Cake {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
}

export default function HomeClient({ featuredCakes }: { featuredCakes: Cake[] }) {
  const { addToCart } = useCart();
  const [clicked, setClicked] = useState<string | null>(null);
  const [modalClicked, setModalClicked] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  function openModal(cake: Cake) {
    setSelectedCake(cake);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleAddToCart(cake: Cake, isModal = false) {
    addToCart({
      productId: cake.id,
      name: cake.name,
      price: cake.price,
      imageUrl: cake.imageUrl,
      quantity: 1,
    });

    if (isModal) {
      setModalClicked(cake.id);
      setTimeout(() => setModalClicked(null), 600);
    } else {
      setClicked(cake.id);
      setTimeout(() => setClicked(null), 600);
    }

    toast.success(`${cake.name} added to cart!`, {
      icon: "🛒",
      style: { background: "#FADADD", color: "#6B0F1A" },
    });
  }

  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-pink-800 mb-8">Featured Cakes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredCakes.map((cake) => (
          <div key={cake.id} className="bg-white rounded-md shadow-md p-4">
            <div className="relative w-full h-48 mb-4">
              <Image src={cake.imageUrl} alt={cake.name} fill className="object-cover rounded-md" />
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

              <div className="relative">
                <button
                  onClick={() => handleAddToCart(cake)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition relative"
                >
                  Add to Cart
                </button>

                <AnimatePresence>
                  {clicked === cake.id && (
                    <motion.span
                      key="cake-icon"
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

      {isModalOpen && selectedCake && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
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
            <div className="relative mt-4">
              <button
                onClick={() => handleAddToCart(selectedCake, true)}
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 relative"
              >
                Add to Cart
                <AnimatePresence>
                  {modalClicked === selectedCake.id && (
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
