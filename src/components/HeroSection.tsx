"use client";

import { Bike, Leaf, Smartphone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function HeroSection() {
  const slides = [
    {
      id: 1,
      title: "Choose your necessary products",
      icon: <Leaf className="w-16 h-16" />,
      subtitle: "Fresh and organic products just for you",
      btnText: "Shop Now",
      image:"https://plus.unsplash.com/premium_photo-1683887064255-1c428d0b3934?w=800",
    },
    {
      id: 2,
      title: "Fast and reliable delivery",
      icon: <Bike className="w-16 h-16" />,
      subtitle: "Get your daily dose with fast delivery",
      btnText: "Order Now",
      image:"https://images.unsplash.com/photo-1690625642622-ba0bed1a68a0?w=800",
    },
    {
      id: 3,
      title: "Shop anytime anywhere",
      icon: <Smartphone className="w-16 h-16" />,
      subtitle: "Easy and seamless shopping experience",
      btnText: "Explore More",
      image:"https://plus.unsplash.com/premium_photo-1661774910035-05257f7d73a6?w=800",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="w-[90%] mx-auto mt-32 min-h-[60vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center h-full gap-8 p-8 md:p-16">
        
        {/* LEFT CONTENT */}
       
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-75 md:h-100"
          >
            <Image
              src={slide.image}
              alt="Hero image"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* RIGHT IMAGE */}
         <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {slide.icon}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              {slide.title}
            </h1>
            <p className="text-gray-600 text-lg">{slide.subtitle}</p>
            <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
              {slide.btnText}
            </button>
          </motion.div>
        </AnimatePresence>
         </div>

         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${index === currentSlide ? 'bg-black' : 'bg-gray-300'}`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
         </div>

    </div>
  );
}

export default HeroSection;
