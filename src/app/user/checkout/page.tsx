"use client"
import React, { useState } from 'react'
import {motion} from "motion/react"
import { ArrowLeft, Building, Home, MapPin, Navigation, Phone, Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

function Checkout() {
    const router =useRouter()
    const {userData}=useSelector((state:RootState)=>state.user)
    const [address, setAddress]= useState({
        fullName: userData?.name,
        mobile:userData?.mobile,
        city:"",
        division:"",
        pinCode:"",
        fullAddress:""

    })
    
  return (
    <div className='w-[92%] md:w-[80%] mx-auto py-10 relative'>
        <motion.button
        whileTap={{scale:0.97}}
        className='absolute left-0 top-2 flex items-center gap-2 font-semibold'
        onClick={()=>router.push("/user/cart")}
        > <ArrowLeft size={16}/> <span>Back to Cart</span></motion.button>

        <motion.h1
         initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.3}}
         className='text-3xl md:text-4xl font-bold text-center mb-10'>Checkout</motion.h1>

         <div className='grid md:grid-cols-2 gap-8'> 
            <motion.div
            initial={{opacity:0, x:-20}}
        animate={{opacity:1, x:0}}
        transition={{duration:0.5}}
            className='bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 '
            >
                <h2 className='text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2'> <MapPin/> Delivery Address</h2>

                <div className='space-y-4'>
                    <div className='relative'>
                        <User size={18} className='absolute left-3 top-3'/>
                        <input type="text" value={address.fullName} onChange={(e)=>setAddress({...address,fullName:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                    </div>

                       <div className='relative'>
                        <Phone size={18} className='absolute left-3 top-3'/>
                        <input type="text" value={address.mobile} onChange={(e)=>setAddress({...address,mobile:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                    </div>

                     <div className='relative'>
                        <Home size={18} className='absolute left-3 top-3'/>
                        <input type="text" placeholder='Full address' value={address.fullAddress} onChange={(e)=>setAddress({...address,fullAddress :e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                    </div>

                    <div className='grid grid-cols-3 gap-3'>
                        <div className='relative'>
                        <Building size={18} className='absolute left-3 top-3'/>
                        <input type="text" placeholder='City..' value={address.city} onChange={(e)=>setAddress({...address,city :e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                    </div>

                        <div className='relative'>
                        <Navigation size={18} className='absolute left-3 top-3'/>
                        <input type="text" placeholder='Division...' value={address.division} onChange={(e)=>setAddress({...address,division :e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                       </div>

                        <div className='relative'>
                        <Search size={18} className='absolute left-3 top-3'/>
                        <input type="text" placeholder='pincode' value={address.pinCode} onChange={(e)=>setAddress({...address,pinCode:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                       </div>
                    </div>

                    <div className='flex gap-2 mt-3'>
                        <input type="text" className='flex-1 border rounded-lg p-3 text-sm outline-none' placeholder='search city or area...'/>
                        <button className='bg-black text-white px-5 rounded-lg font-medium'>Search</button>
                    </div>

                </div>

            </motion.div>
         </div>
    </div>
  )
}

export default Checkout