"use client"
import { Apple, ChevronLeft, ChevronRight, Coffee, Cookie, Heart, Home, Leaf, Milk, Wheat } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

function CategorySlider() {
    const categories =[
        {id:1, name: "Fruits & vagetables", icon: Apple, color: "bg-white"},
        {id:2, name: "Dairy Products", icon: Milk, color: "bg-white"},
        {id:3, name: "Bakery Items", icon: Wheat, color: "bg-white"},
        {id:4, name: "Beverages", icon: Coffee, color: "bg-white"},
        {id:5, name: "Snacks", icon: Cookie, color: "bg-white"},
        {id:6, name: "Household Supplies", icon: Home, color: "bg-white"},
        {id:7, name: "Personal Care", icon: Heart, color: "bg-white"},
        {id:8, name: "Others", icon: Leaf, color: "bg-white"},
    ]

    const [showLeftArrow, setShowLeftArrow] = useState<boolean>(true);
    const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

    const scrollRef =useRef<HTMLDivElement>(null);
    const scroll = (direction: "left" | "right")=>{
        if(!scrollRef.current) return;
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current.scrollBy({left: scrollAmount, behavior: "smooth"});
    }

    const checkScroll=()=>{
        if(!scrollRef.current) return;
        const {scrollLeft, scrollWidth, clientWidth}=scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth <= scrollWidth - 5);
         }

        //  useEffect(()=>{
        //    const autoScroll = setInterval(()=>{
        //         if(!scrollRef.current)return;
        //         const {scrollLeft, scrollWidth, clientWidth}=scrollRef.current;
        //         if(scrollLeft + clientWidth >= scrollWidth){
        //             scrollRef.current.scrollTo({left:0, behavior:"smooth"});
        //         }
        //         else{
        //             scrollRef.current.scrollTo({left:300, behavior:"smooth"});
        //         }
        //     },2000)
        //     return ()=>clearInterval(autoScroll);
        //  },[])

    useEffect(()=>{
        scrollRef.current?.addEventListener("scroll", checkScroll);
        checkScroll();
        return ()=>removeEventListener("scroll", checkScroll);
    },[])


  return (
    <motion.div
    initial={{opacity:0, y:50}}
    whileInView={{opacity:1, y:0}}
    transition={{duration:0.5}}
    viewport={{once:false,amount:0.5}}
    className='w-[90%] md:w-[80%] mx-auto mt-10 relative'
    >
    <h2 className='text-2xl text-gray-700 md:text-3xl font-bold mb-6 text-center'>🛒 Shop by Category</h2>

    {showLeftArrow &&  <button onClick={()=>scroll("left")} className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center'><ChevronLeft className='w-6 h-6'/></button>}

   
    <div className='flex px-10 pb-4 gap-6 overflow-x-auto scrollbar-hide scroll-smooth' ref={scrollRef}>
        {
            categories.map((category)=>{
                const Icon=category.icon
                return <motion.div
                className={`min-w-37 md:min-w-45 flex flex-col items-center justify-center rounded-2xl ${category.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
                key={category.id}
                >
                    <div key={category.id} className='flex flex-col items-center justify-center p-5'>
                {Icon  && <Icon className='w-12 h-12 md:w-16 md:h-16 mb-4'/>}
                <p key={category.id} className='text-center text-sm md:text-base font-semibold '>{category.name}</p>

                    </div>
                </motion.div>
            })}

    </div>

    {showRightArrow && <button onClick={()=>scroll("right")} className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center'><ChevronRight className='w-6 h-6'/></button>}
    </motion.div>
  )
}

export default CategorySlider