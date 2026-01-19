"use client"
import AdminOrdersCards from '@/components/AdminOrdersCards'
import { IOrder } from '@/models/order.model'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

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