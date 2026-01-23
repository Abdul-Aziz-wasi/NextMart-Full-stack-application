"use client"
import AdminOrdersCards from '@/components/AdminOrdersCards'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import mongoose from 'mongoose'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export interface IOrder{
    _id?:mongoose.Types.ObjectId
    user:mongoose.Types.ObjectId
    items:[
        {
            grocery:mongoose.Types.ObjectId
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
    assignment?:mongoose.Types.ObjectId
    assignedDeliveryBoy:IUser
    status:"pending" | "out of delivery" | "delivered"
    createdAt:Date
    updatedAt:Date
}

function ManageOrders() {
    const router =useRouter()
    const [orders, setOrders]=useState<IOrder[]>()
    useEffect(()=>{
        const getOrders = async()=>{
            try {
                const result = await axios("/api/admin/get-orders")
                setOrders(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getOrders()
    },[])

    useEffect(():any=>{
        const socket=getSocket()
        socket.on("new-order",(newOrder)=>{
            setOrders((prev)=>[newOrder,...prev!])
        })
        return ()=>socket.off("new-order")
    },[])
  return (
    <div className='min-h-screen bg-gray-100 w-full'>
        <div className='fixed top-0 left-0 w-full  shadow-sm border-b z-50'>
        <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
        <button className='p-2 bg-black rounded-full' onClick={()=>router.push("/")}>
        <ArrowLeft size={24} className='text-white' />
        </button>
        <h2 className='text-xl font-bold'>Manage Orders</h2>
        </div>
        </div>
          <div className='max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8'>
            <div className='space-y-6'>
        {orders?.map((order,index)=>(
            <AdminOrdersCards order={order} key={index}/>
        ))}
        </div>
        </div>

        
    </div>
  )
}

export default ManageOrders