"use client"
import { IOrder } from '@/models/order.model'
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Truck } from 'lucide-react'
import {motion} from "motion/react"
import Image from 'next/image'
import React, { useState } from 'react'

function UserOrderCard({order}:{order:IOrder}) {
    const [expanded, setExpanded]=useState(false)

    const getStatusColor=(status:string)=>{
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-300"
            case "out of delivery":
                return "bg-blue-100 text-blue-700 border-blue-300"
            case "delivered":
                return "bg-green-100 text-green-700 border-blue-300"
        
            default: 
            return "bg-black text-white border"
                break;
        }
    }
  return (
    <motion.div 
    initial={{opacity:0, y:15}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.4}}
    className='bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden'>

        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3 px-5 py-4'>
            <div>
                <h3 className='text-lg font-semibold'>order <span className='font-bold'>#{order._id?.toString().slice(-6)}</span></h3>
                <p className='text-xs mt-1'>{new Date(order.createdAt!).toLocaleString()}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border 
                    ${order.isPaid
                    ?"bg-green-100 text-green-700 border-green-300"
                    :"bg-red-100 text-red-700 border-red-300"}`}>{order.isPaid?"paid":"unpaid"}</span>

                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border 
                    ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>

            </div>
        </div>

        <div className='p-5 space-y-4'>
            {order.paymentMethod == "cod"?   <div className='flex items-center gap-2 text-sm'>
                <Truck size={16}/>
                Cash on delivery
                </div> :  <div className='flex items-center gap-2 text-sm'>
                <CreditCard size={16}/>
                Online payment
                </div>}

                <div className='flex items-center gap-2 text-sm'>
                    <MapPin size={16}/>
                    <span className='truncate'>{order.address.fullAddress}</span>
                    </div>
           <div className='border-t border-gray-300 pt-3'>
            <button
            onClick={()=>setExpanded(prev=>!prev)}
             className='w-full flex items-center justify-between text-sm font-medium text-gray-700'>
                <span className='flex items-center gap-2'>
                    <Package size={16}/>
                    {expanded ? "Hide Order Items" : `View ${order.items.length} Items`}
                </span>
                {expanded?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
            </button>

            <motion.div
            initial={{height:0, opacity:0}}
            animate={{ height:expanded ? "auto" : 0,
                opacity:expanded ? 1 : 0 }}
                transition={{duration:0.3}}
                className='overflow-hidden'
            >
                <div className='mt-3 space-y-3'>
                    {order.items.map((item,index)=>(
                        <div
                        key={index}
                         className='flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2 hover:bg-gray-200'>
                            <div className='flex items-center gap-3'>
                                <Image src={item.image} alt={item.name} width={48} height={48} className=' rounded-lg object-cover border border-gray-200'/>
                            <div>
                                <p className='text-sm font-medium'>{item.name}</p>
                                <p className='text-xs'>{item.quantity} x {item.unit}</p>
                            </div>
                            </div>

                            <p className='text-sm font-semibold'>{Number(item.price)*item.quantity}tk</p>

                        </div>
                    ))}
                </div>

            </motion.div>

           </div>

           <div className='border-t pt-3 flex justify-between items-center font-semibold text-sm border-gray-300'>
                    <div className='flex items-center gap-2 text-sm'>
                    <Truck size={16}/>
                    <span>Delivery: <span className='text-green-700'>{order.status}</span></span>
                    </div>
                    <div>
                       <span className='font-bold'>Total: {order.totalAmount}tk</span> 
                    </div>
           </div>
        </div>

    </motion.div>
  )
}

export default UserOrderCard