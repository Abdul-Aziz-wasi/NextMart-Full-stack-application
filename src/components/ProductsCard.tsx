"use client"
import mongoose from 'mongoose';
import React from 'react'
import { motion } from 'motion/react';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice';

interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function ProductsCard({product}:{product:IProduct}) {

  const dispatch = useDispatch<AppDispatch>()
  const {cartData}= useSelector((state:RootState)=>state.cart)
  const cartItem =cartData.find(item=>item._id==product._id)

  return (
    <motion.div
    initial={{opacity:0, y:50, scale:0.8}}
    whileInView={{opacity:1, y:0, scale:1}}
    transition={{duration:0.5}}
    viewport={{once:false,amount:0.5}}
    className='bg-white rounded-2xl shadow-sm hover:shadow-xl  overflow-hidden flex flex-col'
    >
        <div className='relative w-full aspect-4/3 overflow-hidden group'>
            <Image src={product.imageUrl} fill alt={product.name}/>
        </div>

        <div className='flex flex-col flex-1 p-4'>
            <p className='text-xs text-gray-500 font-medium mb-1'>{product.category}</p>
            <h3 className='font-bold text-lg'>{product.name}</h3>
            <div className='mt-auto flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full '>{product.unit}</span>
                <span className='text-lg font-bold'>{product.price} tk</span>
            </div>

            {!cartItem ? <motion.button
            whileTap={{scale:0.96}}
            className='mt-4 flex items-center cursor-pointer justify-center gap-2 bg-black hover:text-gray-300 text-white rounded-full py-2 text-sm font-medium'
            onClick={()=>dispatch(addToCart({...product,quantity:1}))}
            >
            <ShoppingCart/>Add to Cart
            </motion.button> 
            :
            <motion.div
            initial={{opacity:0, y:10}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.3}}
            className='mt-4 flex items-center justify-center bg-black py-2 px-4 gap-4 rounded-full'
            >
              <button onClick={()=>dispatch(decreaseQuantity(product._id))} className='w-7 h-7 flex items-center justify-center rounded-full bg-white'><Minus size={16}/></button>
              <span className='text-white'>{cartItem.quantity}</span>
              <button onClick={()=>dispatch(increaseQuantity(product._id))} className='w-7 h-7 flex items-center justify-center rounded-full bg-white'><Plus size={16}/></button>

            </motion.div>
            }
            
        </div>
        
    </motion.div>
  )
}

export default ProductsCard