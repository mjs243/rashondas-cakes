"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const defaultCartValue: CartContextType = {
    cartItems: [],
    addToCart: () => {},
    updateQuantity: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
};

const CartContext = createContext<CartContextType>(defaultCartValue);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Add an item to the cart
    function addToCart(item: CartItem) {
        setCartItems((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.productId === item.productId);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.productId === item.productId
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    }

    // Update the quantity of an item in the cart
    function updateQuantity(productId: string, quantity: number) {
        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    }

    // Remove an item from the cart
    function removeFromCart(productId: string) {
        setCartItems((prevCart) => prevCart.filter((item) => item.productId !== productId));
    }

    // Clear the cart
    function clearCart() {
        setCartItems([]);
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook to use cart context
export function useCart() {
    return useContext(CartContext);
}