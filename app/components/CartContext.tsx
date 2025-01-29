"use client";

import React, { createContext, useContext, useState } from "react";

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface CartContextValue {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
}

const defaultCartValue: CartContextValue = {
    cartItems: [],
    addToCart: () => {},
}

const CartContext = createContext<CartContextValue>(defaultCartValue);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
        setCartItems((prev) => {
            const existingIndex = prev.findIndex((i) => i.productId === item.productId);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, { ...item, quantity }];
        });
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("userCart must be used within CartProvider");
    }
    return context;
}