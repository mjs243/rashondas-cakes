"use client";

import { useState } from "react";
import Image from "next/image";

const dummySlides = [
    {
        id: 1,
        img: "/images/slide1.jpg",
        caption: "Freshly Baked Goodness",
    },
    {
        id: 2,
        img: "/images/slide2.jpg",
        caption: "Made with TLC",
    },
    {
        id: 3,
        img: "/images/slide3.jpg",
        caption: "Come Get This Sugar!"
    },
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    function handleNext() {
        setCurrentSlide((prev) => (prev + 1) % dummySlides.length);
    }

    function handlePrev() {
        setCurrentSlide((prev) => (prev - 1 + dummySlides.length) % dummySlides.length);
    }

    const slide = dummySlides[currentSlide];

    return (
        <section className="relative w-full h-[60vh] overflow-hidden bg-black text-white">
            {/* Slide Image */}
            <div className="absolute inset-0">
                <Image
                    src={slide.img}
                    alt={slide.caption}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30" />
            </div>

            {/* Caption & Buttons */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                <h2 className="text-4xl font-bold mb-4">{slide.caption}</h2>
                <a
                    href="/catalog"
                    className="inline-block bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition"
                >
                    Shop Now
                </a>
            </div>

            {/* Nav Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
                >
                    ◀
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
                >
                    ▶
                </button>
        </section>
    );
}