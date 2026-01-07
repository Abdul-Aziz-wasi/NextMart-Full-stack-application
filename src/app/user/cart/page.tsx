"use client"
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/cartSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash2 } from 'lucide-react'
import {AnimatePresence, motion} from "motion/react"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function CartPage() {
    const {cartData,subTotal,deliveryFee,finalTotal}= useSelector((state:RootState)=>state.cart)
    const dispatch =useDispatch<AppDispatch>()
    const router =useRouter()
  return (
    <div className='w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 mb-24 relative'>
        <Link href={"/"} className='absolute -top-2 left-0 flex itmes-center gap-2 font-medium hover:text-gray-800'>
        <ArrowLeft size={20}/> <span className='hidden sm:inline'>Back to home</span>
        </Link>
        <motion.h2
        initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.3}}
        className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 text-gray-700'
        >🛒 Your Shopping Cart </motion.h2>

        {cartData.length == 0 ? (
            <motion.div
            initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.3}}
        className='text-center py-20 bg-white rounded-2xl shadow-md'
            >
                <ShoppingBasket className='w-16 h-16 mx-auto mb-4'/>
                <p className='text-lg mb-6 font-medium text-gray-500'>Your cart is empty. Add some product to continue shopping!</p>
                <Link href={"/"} className='px-6 py-3 rounded-full inline-block bg-black text-white font-medium'>Continue shopping</Link>

            </motion.div>
        ) : (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2 space-y-5">
    <AnimatePresence>
      {cartData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative w-full
            flex flex-col sm:flex-row
            items-center sm:items-center
            gap-4 sm:gap-6
            bg-white
            rounded-xl
            border border-gray-100
            p-4 sm:p-5
            shadow-sm hover:shadow-xl
          "
        >
          {/* Image */}
          <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-contain p-3"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-gray-500 line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">{item.unit}</p>
            <p className="font-bold mt-1 text-sm sm:text-base">
              {Number(item.price) * item.quantity} tk
            </p>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-center gap-3 px-3 py-2 rounded-full shrink-0">
            <button
              className="rounded-full bg-gray-200 p-1.5"
              onClick={() => dispatch(decreaseQuantity(item._id))}
            >
              <Minus size={14} />
            </button>

            <span className="font-semibold text-gray-500 w-6 text-center">
              {item.quantity}
            </span>

            <button
              className="bg-gray-200 rounded-full p-1.5"
              onClick={() => dispatch(increaseQuantity(item._id))}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Delete */}
          <button onClick={()=>dispatch(removeFromCart(item._id))} className="ml-auto shrink-0 text-gray-400 hover:text-red-500 transition">
            <Trash2 size={18} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>

  <motion.div 
  initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{duration:0.3}}
  className='bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24 border border-gray-100 flex flex-col'
  >
    <h2 className='text-lg sm:text-xl font-bold mb-3 '>Order Summary</h2>
      <div className='space-y-3 text-gray-700 text-sm sm:text-base mb-4'>
        <div className='flex justify-between'>
            <span>Sub Total</span>
            <span className='font-semibold'>{subTotal} tk</span>
        </div>

         <div className='flex justify-between'>
            <span>Delivery Fee</span>
            <span className='font-semibold'>{deliveryFee} tk</span>
        </div>

        <hr className='my-3'/>

      <div className='flex justify-between text-black font-bold'>
            <span>Final Total</span>
            <span className=''>{finalTotal} tk</span>
        </div>

      </div>

      <motion.button
      whileTap={{scale:0.95}}
      className='w-full mt-6 bg-black text-white py-3 rounded-full font-semibold text-sm sm:text-base'
      onClick={()=>router.push("/user/checkout")}
      >Proceed to Checkout</motion.button>
      
  </motion.div>
</div>

        )}
    </div>
  )
}

export default CartPage