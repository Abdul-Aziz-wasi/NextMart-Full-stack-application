"use client"
import { Boxes, ClipboardCheck, LogOut, Menu, Package, PlusCircle, Search, ShoppingCart, User, X } from 'lucide-react'
import mongoose from 'mongoose'
import { AnimatePresence,motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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
  const [menuOpen, setMenuOpen]=useState(false)

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

  const sideBar =menuOpen?createPortal(
    <AnimatePresence>
      <motion.div
      initial={{opacity:0, x:-100}}
      animate={{opacity:1, x:0}}
      exit={{opacity:0, x:-100}}
      transition={{type:"spring", stiffness:100, damping:14}}
       className='fixed top-0 left-0 w-64 h-full bg-yellow-200 shadow-lg z-9999 flex flex-col p-4'>
        <div className='flex justify-between items-center mb-2'>
          <h1 className='font-extrabold text-2xl tracking-wide'>Admin Panel</h1>
          <button className='text-2xl font-bold cursor-pointer' onClick={()=>setMenuOpen(false)}><X/></button>
        </div>

        <div className='flex items-center gap-3 p-3 mt-3 rounded-xl '>
          <div className='relative w-12 h-12 rounded-full overflow-hidden border-2'>
          {user.image ? <Image src={user.image} alt='user image'  fill className='object-cover rounded-full '/> : <User/>}
          </div>
          <div>
            <h1 className='text-lg font-semibold'>{user.name}</h1>
            <p className=''>{user.role}</p>
          </div>
        </div>

        <div className='flex flex-col gap-3 font-medium mt-6'>
          <Link href={"/admin/add-product"} className='flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-amber-200'><PlusCircle className='h-5 w-5'/> Add Products</Link>

              <Link href={""} className='flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-amber-200'><Boxes className='h-5 w-5'/>View Products</Link>

              <Link href={""} className='flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-amber-200'><ClipboardCheck className='h-5 w-5'/>Manage Orders</Link>
        </div>

        <div className='my-5 border-t'></div>
        <div className='flex items-center gap-3 p-3 font-bold text-lg mt-auto bg-white rounded-lg text-red-400'
        onClick={async ()=>await signOut({callbackUrl:"/"})}
        ><LogOut className='h-5 w-5'/> Log Out</div>
      

      </motion.div>
    </AnimatePresence>,document.body
  ):null

  return (
    /* Navbar */

    <div className='w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-yellow-200 to-yellow-200 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50'>

      {/* Logo */}
        <Link href={"/"} className='font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform'>Nextmart</Link>

      {/* Search Bar visible for user*/}
      {user.role==="user" && <form className='hidden  md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md'>
        <Search className='text-gray-500 h-5 w-5 mr-2'/>
        <input type="text"  placeholder='Search...' className='w-full outline-none text-gray-700 ' />
        </form>}
        

      {/* Right Side */}
        <div className='flex items-center gap-3 md:gap-6 relative'>

      {/* Mobile Search Icon visible for user*/}
          {user.role=="user" && <>
          <div className='bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 md:hidden' onClick={()=>setSearchOpen(prev=>!prev)}>
            <Search className='w-6 h-6'/>
             </div>

              <Link href={"/cart"} className='bg-white relative rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition-transform'>
          <ShoppingCart className='w-6 h-6'/>
          <span className='absolute -top-1 -right-1 bg-white text-xs h-5 w-5 flex items-center justify-center rounded-full font-semibold shadow'>0</span>
          </Link>

          </>}

          {/* Admin Links */}
          {
            user.role=="admin" && <>
            <div className='hidden md:flex items-center gap-4'>
              <Link href={"/admin/add-product"} className='flex items-center gap-2 bg-white font-semibold px-4 py-2 rounded-full hover:bg-amber-200'><PlusCircle className='h-5 w-5'/> Add Products</Link>

              <Link href={""} className='flex items-center gap-2 bg-white font-semibold px-4 py-2 rounded-full hover:bg-amber-200'><Boxes className='h-5 w-5'/>View Products</Link>

              <Link href={""} className='flex items-center gap-2 bg-white font-semibold px-4 py-2 rounded-full hover:bg-amber-200'><ClipboardCheck className='h-5 w-5'/>Manage Orders</Link>
            </div>

              {/* Mobile Menu Icon */}
            <div className='md:hidden rounded-full w-11 h-11 flex items-center justify-center hover:scale-105 transition-transform'onClick={()=>setMenuOpen(prev=>!prev)}>
              <Menu className='h-5 w-5'/>
            </div>
            </>
          }


         

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

                {user.role==="user" && <Link href={""} onClick={()=>setOpen(false)} className='flex items-center gap-2 py-3 px-3 hover:bg-amber-200 rounded-lg font-medium'>
                <Package className='w-5 h-5'/>
                My Orders
                </Link>}
                

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

         {sideBar}
        </div>
  )
}

export default Navbar