"use client"
import LiveMap from '@/components/LiveMap'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import mongoose from 'mongoose'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

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
interface ILocation{
  latitude:number
  longitude:number
}

function TrackOrder({params}:{params:{orderId:string}}) {
  const {orderId}=useParams()
  const [order,setOrder]=useState<IOrder>()
  const router =useRouter()
  const [orderLocation, setOrderLocation]=useState<ILocation>(
      {
      latitude:0,
      longitude:0
    })
    const [deliveryBoyLocation, setDeliveryBoyLocation]=useState<ILocation>(
      {
        latitude:0,
      longitude:0
      }
    )
    const {userData}=useSelector((state:RootState)=>state.user)

  useEffect(()=>{
    const getOrder =async()=>{
      try {
        const result =await axios(`/api/user/get-order/${orderId}`)
        setOrder(result.data)
        setOrderLocation({
          latitude:result.data.address.latitude,
          longitude:result.data.address.longitude
        })
        setDeliveryBoyLocation({
          latitude:result.data.assignedDeliveryBoy.location.coordinates[1],
          longitude:result.data.assignedDeliveryBoy.location.coordinates[0]
        })
      } catch (error) {
        console.log(error)
      }
    }
    getOrder()
  },[userData?._id])

  useEffect(():any=>{
    const socket =getSocket()
    socket.on("update-deliveryBoy-location",({userId,location})=>{
      if(userId.toString() === order?.assignedDeliveryBoy._id?.toString()){
        setDeliveryBoyLocation({
          latitude:location.coordinates[1],
          longitude:location.coordinates[0]
        })
      }
    })
    return ()=>socket.off("update-deliveryBoy-location")
  },[order])
  return (
    <div className='w-full min-h-screen'>
      <div className='max-w-2xl mx-auto pb-24'>
        <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b flex items-center gap-4 shadow z-999'>
          <button onClick={()=>router.back()} className='p-2 bg-black rounded-full'><ArrowLeft size={20} className='text-white'/></button>
          <div>
            <h2 className='text-2xl font-semibold mb-2'>Track Order</h2>
            <p className='text-sm text-gray-600'>Order #{order?._id!.toString().slice(-6)} <span className='font-semibold text-green-600'>{order?.status}</span></p>
          </div>
        </div>

        <div className='px-4 mt-6'>
          <div className='rounded-3xl overflow-hidden border shadow'>
            <LiveMap orderLocation={orderLocation} deliveryBoyLocation={deliveryBoyLocation}/>
            
          </div>

        </div>

      </div>

    </div>
  )
}

export default TrackOrder