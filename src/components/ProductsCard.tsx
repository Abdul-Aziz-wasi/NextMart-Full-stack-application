"use client"
import mongoose from 'mongoose';
import React from 'react'
import { motion } from 'motion/react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function ProductsCard({product}:{product:IProduct}) {
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
            <motion.button
            whileTap={{scale:0.96}}
            className='mt-4 flex items-center cursor-pointer justify-center gap-2 bg-black hover:text-gray-300 text-white rounded-full py-2 text-sm font-medium'
            >
            <ShoppingCart/>Add to Cart
            </motion.button>
        </div>
        
    </motion.div>
  )
}

export default ProductsCard