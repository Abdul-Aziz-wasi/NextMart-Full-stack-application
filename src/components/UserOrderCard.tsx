"use client"
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import { Bike, ChevronDown, ChevronUp, CreditCard, MapPin, Package, Truck, UserCheck } from 'lucide-react'
import {motion} from "motion/react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export interface IOrder{
    _id?:string
    user:string
    items:[
        {
            grocery:string
            name:string
            price:string
            image:string
            unit:string
            quantity:number
        }
    ]
    isPaid:boolean
    totalAmount:number
    paymentMethod:"cod" | "online"
    address:{
        fullName:string
        mobile:string
        city:string
        state:string
        division:string
        pinCode:string
        fullAddress:string
        latitude:number
        longitude:number
    }
    assignment?:string
    assignedDeliveryBoy:IUser
    status:"pending" | "out of delivery" | "delivered"
    createdAt:Date
    updatedAt:Date
}

function UserOrderCard({order}:{order:IOrder}) {
    const [expanded, setExpanded]=useState(false)
    const [status,setStatus]=useState(order.status)
    const router =useRouter()

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

    useEffect(():any=>{
        const socket =getSocket()
        socket.on("order-status-update",(data)=>{
            if(data.orderId.toString() ==order._id?.toString()){
                setStatus(data.status)
            }
        })
        return ()=>socket.off("order-status-update")
    },[])
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
                {status !=="delivered" && 
                 <span className={`px-3 py-1 text-xs font-semibold rounded-full border 
                    ${order.isPaid
                    ?"bg-green-100 text-green-700 border-green-300"
                    :"bg-red-100 text-red-700 border-red-300"}`}>{order.isPaid?"paid":"unpaid"}</span>}
               

                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border 
                    ${getStatusColor(status)}`}>
                        {status}
                    </span>

            </div>
        </div>

        {status !=="delivered" && 
        <div className='p-5 space-y-4'>
            {order.paymentMethod == "cod"?   <div className='flex items-center gap-2 text-sm'>
                <Truck size={16}/>
                Cash on delivery
                </div> :  <div className='flex items-center gap-2 text-sm'>
                <CreditCard size={16}/>
                Online payment
                </div>}

                {order.assignedDeliveryBoy && <>
           <div className='mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between'>
                <div className='flex items-center gap-3 text-sm text-gray-700'>
                <UserCheck className='text-blue-600' size={18}/>
                <div className='font-semibold'>
                <p>Assigned to: <span>{order.assignedDeliveryBoy.name}</span></p>
                <p className='text-xs text-gray-600'>📞 {order.assignedDeliveryBoy.mobile}</p>
                </div>
                </div>
                <a className='bg-black text-white text-xs px-3 py-2 rounded-lg ' href={`tel:${order.assignedDeliveryBoy.mobile}`}>Call</a>
            </div>
            <button onClick={()=>router.push(`/user/track-order/${order._id?.toString()}`)} className='w-full flex items-center justify-center gap-2 bg-black text-white font-semibold px-4 py-2 rounded-xl shadow'><Bike size={18}/>Track your order</button>
            </>}

            

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
                    <span>Delivery: <span className='text-green-700'>{status}</span></span>
                    </div>
                    <div>
                       <span className='font-bold'>Total: {order.totalAmount}tk</span> 
                    </div>
           </div>
        </div>}

          

        

    </motion.div>
  )
}

export default UserOrderCard