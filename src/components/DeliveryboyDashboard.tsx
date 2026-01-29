"use client"
import { getSocket } from '@/lib/socket'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LiveMap from './LiveMap'
import DeliveryboyChat from './DeliveryboyChat'


interface ILocation{
  latitude:number
  longitude:number
}

function DeliveryboyDashboard() {
  const [assignments, setAssignments]=useState<any[]>([])
  const [activeOrder, setActiveOrder] =useState<any>(null)
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


  // const fetchAssignments =async()=>{
  //     try {
  //       const result =await axios.get("/api/delivery/get-assignments")
  //       setAssignments(result.data)
  //       console.log(result)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //    const fetchCurrentOrder=async()=>{
  //   try {
  //     const result =await axios.get('/api/delivery/current-order')
  //     console.log(result)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  

  useEffect(():any=>{
    const socket =getSocket()
    socket.on("new-assignment",(deliveryAssignment)=>{
      setAssignments((prev)=>[...prev,deliveryAssignment])
    })
    return ()=>socket.off("new-assignment")
  },[])

  const handleAccept = async (id:string)=>{
    try {
      const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
      console.log(result)
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(()=>{
    const socket =getSocket()
 if(!userData?._id) return
        if(!navigator.geolocation) return
            const watcher =navigator.geolocation.watchPosition((position)=>{
                const latitude = position.coords.latitude
                const longitude =position.coords.longitude
                setDeliveryBoyLocation({
                  latitude:latitude,
                  longitude:longitude
                })
                socket.emit("update-location",{
                    userId:userData?._id,
                    longitude:longitude,
                    latitude:latitude
                    })
            },(error)=>{
                console.log(error)
            },
            {enableHighAccuracy:true}
        )
            return ()=>navigator.geolocation.clearWatch(watcher)
  },[userData?._id])

 useEffect(() => {
  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments")
      setAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order")
      if(result.data.active){
        setActiveOrder(result.data.assignment)
        setOrderLocation({
          latitude:result.data.assignment.order.address.latitude,
          longitude:result.data.assignment.order.address.longitude
        })
      }
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  fetchAssignments()
  fetchCurrentOrder()
}, [userData])

useEffect(():any=>{
  const socket =getSocket()
  socket.on("update-deliveryBoy-location",({userId,location})=>{
    setDeliveryBoyLocation({
      latitude:location.coordinates[1],
      longitude:location.coordinates[0]
    })
  })
  return ()=>socket.off("update-deliveryBoy-location")
})
if(activeOrder && orderLocation){
  return (
    <div className='p-4 pt-30 min-h-screen bg-gray-50'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-2xl font-bold mb-2'>Active Delivery</h1>
        <p className='text-sm mb-4'> order #{activeOrder.order._id.slice(-6)}</p>

        <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
          <LiveMap orderLocation={orderLocation} deliveryBoyLocation={deliveryBoyLocation}/>
        </div>
        <DeliveryboyChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!}/>

      </div>

    </div>
  )
}

  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mt-25 mb-4'>Delivery Assignment</h2>
            {assignments.map((assignment,index)=>(
              <div key={index} className='p-5 bg-white rounded-xl shadow mb-4 border'>
                <p className='text-black'><b>Order Id:</b> #{assignment?.order?._id.slice(-6)}</p>
                <p className=''>{assignment.order.address.fullAddress}</p>

                <div className='flex gap-3 mt-4'>
                  <button onClick={()=>handleAccept(assignment._id)} className='flex-1 bg-green-600 rounded-lg text-white py-2 '>Accept</button>
                  <button className='flex-1 bg-red-600 rounded-lg text-white py-2 '>Reject</button>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

export default DeliveryboyDashboard