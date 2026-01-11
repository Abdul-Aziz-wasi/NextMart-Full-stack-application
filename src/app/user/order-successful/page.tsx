"use client"
import React from 'react'
import { motion, spring} from "motion/react"
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function OrderSuccessful() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] px-6 text-center '>
        <motion.div
        initial={{scale:0, rotate:-180}}
        animate={{scale:1, rotate:0}}
        transition={{
            type:spring,
            damping:10,
            stiffness:100
        }}
        className='relative'
        >
            <CheckCircle className='text-black w-24 h-24 md:h-28'/>
           
        </motion.div>
        <motion.h1
        initial={{opacity:0, y:30}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.4,delay:0.3}}
        className='text-3xl md:text-4xl font-bold mt-6'
        >
            Order Placed Successfully
        </motion.h1>
        <motion.p
         initial={{opacity:0, y:30}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.4, delay:0.5}}
        className='text-gray-600 mt-3 text-sm md:text-base max-w-md'
        >
            Thank you for shopping with us! Your order has been placed and is being proceed. You can track its progress in your  <span className='font-semibold text-black border-b'>My Orders</span> section
        </motion.p>

        <motion.div
        initial={{opacity:0, scale:0.9}}
        animate={{opacity:1, scale:1}}
        transition={{delay:1.2, duration:0.4}}
        className='mt-12'

        >
            <Link href={"/user/my-orders"}>
            <motion.div
            whileHover={{scale:1.04}}
            whileTap={{scale:0.93}}
            className='flex items-center gap-2 bg-black text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg '
            >Go to My Order Page <ArrowRight/></motion.div>
            </Link>
        </motion.div>

        

    </div>
  )
}

export default OrderSuccessful