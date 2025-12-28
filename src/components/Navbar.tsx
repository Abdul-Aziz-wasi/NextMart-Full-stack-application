"use client"
import { Cross, LogOut, Package, Search, ShoppingCart, User, X } from 'lucide-react'
import mongoose from 'mongoose'
import { AnimatePresence,motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

interface IUser{
    _id?:mongoose.Types.ObjectId,
    name:string,
    email:string,
    password?:string,
    mobile?:string,
    role:"user" | "deliveryboy" | "admin"
    image?:string

}

function Navbar({user}:{user:IUser}) {

  const [open, setOpen]=useState(false)
  const profileDropdown=useRef<HTMLDivElement>(null)
  const [searchOpern, setSearchOpen]=useState(false)

  useEffect(()=>{
    const handleClickOutside=(event:MouseEvent)=>{
      if(profileDropdown.current && !profileDropdown.current.contains(event.target as Node)){
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return ()=>{
      document.removeEventListener("mousedown", handleClickOutside)
    }
  },[])

  return (
    /* Navbar */

    <div className='w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-yellow-200 to-yellow-200 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50'>

      {/* Logo */}
        <Link href={"/"} className='font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform'>Nextmart</Link>

      {/* Search Bar */}
        <form className='hidden  md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md'>
        <Search className='text-gray-500 h-5 w-5 mr-2'/>
        <input type="text"  placeholder='Search...' className='w-full outline-none text-gray-700 ' />
        </form>

      {/* Right Side */}
        <div className='flex items-center gap-3 md:gap-6 relative'>

      {/* Mobile Search Icon */}
          <div className='bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 md:hidden' onClick={()=>setSearchOpen(prev=>!prev)}>
            <Search className='w-6 h-6'/>

          </div>


          <Link href={"/cart"} className='bg-white relative rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition-transform'>
          <ShoppingCart className='w-6 h-6'/>
          <span className='absolute -top-1 -right-1 bg-white text-xs h-5 w-5 flex items-center justify-center rounded-full font-semibold shadow'>0</span>
          </Link>

            <div className='relative' ref={profileDropdown}>
              <div className='bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform ' onClick={()=>setOpen(prev=>!prev)}>
            {user.image ? <Image src={user.image} alt='user image'  fill className='object-cover rounded-full '/> : <User/>}
          </div>

          {/*Profile Dropdown Menu */}
          <AnimatePresence>
            {open &&
             <motion.div
             initial={{opacity:0, scale:0.8, y:-20}}
             animate={{opacity:1, scale:1, y:0}}
             exit={{opacity:0, scale:0.8, y:-20}}
             transition={{duration:0.3}}
              className='absolute mt-3  right-0 bg-white rounded-2xl shadow-lg w-48 flex flex-col overflow-hidden z-999 p-3'>
                <div className='flex items-center gap-3 px-3 py-2 border-b'>
                  <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden relative'>
                     {user.image ? <Image src={user.image} alt='user image'  fill className='object-cover rounded-full '/> : <User/>}
                  </div>

                  <div>
                    <div className='font-semibold'>{user.name}</div>
                    <div className='text-xs capitalize'>{user.role}</div>
                  </div>
                </div>
                <Link href={""} onClick={()=>setOpen(false)} className='flex items-center gap-2 py-3 px-3 hover:bg-amber-200 rounded-lg font-medium'>
                <Package className='w-5 h-5'/>
                My Orders
                </Link>

                <button className='flex items-center gap-2 w-full px-3 py-3 hover:bg-red-500 rounded-lg font-medium'
                onClick={()=>{
                  setOpen(false)
                  signOut({callbackUrl:"/login"})
                }}
                >
                  <LogOut className='h-5 w-5'/>
                  Log Out
                  
                </button>

              </motion.div>}
          </AnimatePresence>

          <AnimatePresence>
            {searchOpern &&
              <motion.div
              initial={{opacity:0, scale:0.8, y:-20}}
              animate={{opacity:1, scale:1, y:0}}
              exit={{opacity:0, scale:0.8, y:-20}}
              transition={{duration:0.3}}
               className='fixed top-24 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 w-[90%] max-w-lg shadow-md flex items-center z-50'>
                
                <Search className='h-5 w-5 mr-2'/>
                <form className='grow'>
                  <input type="text"  placeholder='Search...' className='w-full outline-none text-gray-700 ' />
                </form>
                 <button onClick={()=>setSearchOpen(false)}>
                    <X className='h-5 w-5'/>
                  </button>

              </motion.div>}
                

          </AnimatePresence>
            </div>
           
        </div>
        </div>
  )
}

export default Navbar