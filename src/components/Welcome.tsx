"use client"
import React from 'react'
import { motion } from "motion/react"
import { ArrowRight, Bike, ShoppingBag } from 'lucide-react'

type propType ={
    nextStep:(s:number)=>void
}

function Welcome({nextStep}:propType) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
        <motion.div
            initial={{opacity:0, y:-10}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.6}}
            className='flex items-center gap-3'
        >
            <ShoppingBag className='w-10 h-10'/>
            <h1 className='text-4xl md:text-5xl font-extrabold'>Nextmart</h1>
        </motion.div>

        <motion.p
        initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.6, delay:0.3}}
            className='mt-4 text-lg md:text-xl max-w-lg'
        >
            Shop smart, get it fast. Your everyday essentials delivered in 10 minutes with a seamless online shopping experience.
        </motion.p>

        <motion.div
         initial={{opacity:0, scale:0.9}}
        animate={{opacity:1, scale:1}}
        transition={{duration:0.6, delay:0.5}}
        >
            <Bike className='w-24 h-24 md:w-32 md-h-32 drop-shadow-md' />
            </motion.div>

        <motion.button
         initial={{opacity:0, scale:0.9}}
        animate={{opacity:1, scale:1}}
        transition={{duration:0.6, delay:0.5}}
        className='inline-flex items-center gap-2 mt-8 bg-black text-white font-semibold hover:bg-gray-700 py-3 px-8 rounded-2xl shadow-md cursor-pointer'
        onClick={()=>nextStep(2)}
        >
            Get started <ArrowRight/>
            </motion.button>
        </div>
  )
}

export default Welcome