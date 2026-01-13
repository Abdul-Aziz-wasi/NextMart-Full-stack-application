"use client"
import { IOrder } from '@/models/order.model'
import axios from 'axios'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {motion} from "motion/react"
import React, { useEffect, useState } from 'react'
import UserOrderCard from '@/components/UserOrderCard'

function MyOrders() {
    const router =useRouter()
    const [orders, setOrders]=useState<IOrder[]>()
    const [loading, setLoading]=useState(true)

    useEffect(()=>{
    const getOrders = async()=>{
        try {
            const result = await axios.get("/api/user/my-orders")
            setOrders(result.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    getOrders()
        },[])

        if(loading){
            return <div className='flex items-center justify-center min-h-[50vh]'>Loading your orders...</div>
        }

  return (
    <div className='min-h-screen w-full'>
        <div className='max-w-3xl mx-auto px-4 pt-16 pb-10 relative'>
<div className='fixed top-0 left-0 w-full  shadow-sm border-b z-50'>
<div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
<button className='p-2 bg-black rounded-full' onClick={()=>router.push("/")}>
<ArrowLeft size={24} className='text-white' />
</button>
<h2 className='text-xl font-bold'>My Orders</h2>
</div>
</div>
{orders?.length == 0 ? (
    <div className='pt-20 flex flex-col items-center text-center'>
        <PackageSearch size={70} className='mb-4'/>
        <h2 className='text-xl font-semibold'>No Orders Found</h2>
        <p className='text-sm mt-1'>Start shopping to view your orders here</p>

    </div>
):(
    <div className='mt-4 space-y-6'>
        {orders?.map((order,index)=>(
            <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.4}}
            key={index}
            >
                <UserOrderCard order={order}/>
            </motion.div>
        ))}
    </div>
)}
        </div>
    </div>
  )
}

export default MyOrders