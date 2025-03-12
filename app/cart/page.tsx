"use client";

import { useCart } from "../components/CartContext";
import Image from "next/image";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  async function handleCheckout() {
    if (cartItems.length === 0) return;

    setLoading(true);

    try {
      // 1. Create checkout session on the server
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }), // pass the cart items to the backend
      });

      if (!res.ok) {
        // handle error
        console.error("Checkout creation failed.");
        setLoading(false);
        return;
      }

      const { sessionId } = await res.json();

      // 2. Redirect to Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to load.");
        setLoading(false);
        return;
      }

      await stripe.redirectToCheckout({ sessionId });
      // Clearing the cart can happen after a successful webhook or if you prefer immediate clearing:
      // clearCart();
    } catch (error) {
      console.error("Error during checkout:", error);
      setLoading(false);
    }
  }

  return (
    <section className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-pink-800 mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg">
          Your cart is empty.{" "}
          <Link href="/catalog" className="text-pink-600 hover:underline">
            Browse our cakes!
          </Link>
        </p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-md p-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 border-b py-4"
              >
                {/* Cake Image */}
                <div className="w-24 h-24 relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Cake Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-500">
                    ${(item.price / 100).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Item */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold">
              Subtotal:{" "}
              <span className="text-pink-600">
                ${(totalPrice / 100).toFixed(2)}
              </span>
            </p>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
            <button
              onClick={clearCart}
              className="mt-2 w-full text-gray-600 hover:text-red-500 text-sm"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}
