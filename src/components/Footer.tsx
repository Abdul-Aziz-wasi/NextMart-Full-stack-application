"use client"
import React from 'react'
import {easeOut, motion} from "motion/react"
import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'

function Footer() {
  return (
    <motion.div
    initial={{opacity:0, y:40}}
    whileInView={{opacity:1 ,y:0}}
    viewport={{once:true, amount:0.3}}
    transition={{duration:0.6, ease:easeOut}}
     className='bg-black mt-8'>
    <div className='w-[90%] md:w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-black/40'>
        <div>
            <h2 className='text-2xl text-white font-bold mb-3'>NextMart</h2>
            <p className='text-sm text-white leading-relaxed'>Your one-stop online shop delivery freshness to your doorstep</p>
        </div>

        <div>
            <h2 className='text-xl text-white font-semibold mb-3'>Quick Links</h2>
            <ul className='space-y-2 text-white text-sm'>
                <li><Link href={"/"}>Home</Link></li>
                <li><Link href={"/cart"}>Cart</Link></li>
                <li><Link href={"/my-orders"}>My Orders</Link></li>
            </ul>
        </div>

        <div>
            <h3 className='text-xl font-semibold mb-3 text-white'>Contact Us</h3>
            <ul className='space-y-2 text-white text-sm'>
                <li className='flex items-center gap-2'>
                    <MapPin size={16}/>Chattogram, Bangladesh
                </li>
                <li className='flex items-center gap-2'>
                    <Phone size={16}/>+880123456789
                </li>
                <li className='flex items-center gap-2'>
                    <Mail size={16}/>support@nextmart.com
                </li>
            </ul>

             <div className='flex gap-4 mt-4 text-white'>
            <Link href={"https://facebook.com"}><Facebook className='w-f h-5 ' target='_blank'/></Link>
            <Link href={"https://instagram.com"}><Instagram className='w-f h-5'  target='_blank'/></Link>
            <Link href={"https://twitter.com"}><Twitter className='w-f h-5'  target='_blank'/></Link>

        </div>
        </div>

       
        </div>

    </motion.div>
  )
}

export default Footer