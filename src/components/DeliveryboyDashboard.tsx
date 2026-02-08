"use client"
import { getSocket } from '@/lib/socket'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LiveMap from './LiveMap'
import DeliveryboyChat from './DeliveryboyChat'
import { Loader } from 'lucide-react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


interface ILocation{
  latitude:number
  longitude:number
}

function DeliveryboyDashboard({earning}:{earning:number}) {
  const [assignments, setAssignments]=useState<any[]>([])
  const [activeOrder, setActiveOrder] =useState<any>(null)
  const [showOtpBox, setShowOtpBox]=useState(false)
  const [otpError, setOtpError]=useState("")
  const [sendOtpLoading, setSendOtpLoading]=useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading]=useState(false)
  const [otp, setOtp]=useState("")
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
      fetchCurrentOrder()
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

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments")
      setAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  

 useEffect(() => {
  fetchCurrentOrder()
  fetchAssignments()
  
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

const sendOtp =async()=>{
  setSendOtpLoading(true)
  try {
    const result =await axios.post('/api/delivery/otp/send',{orderId:activeOrder.order._id})
    console.log(result.data)
    setShowOtpBox(true)
    setSendOtpLoading(false)
  } catch (error) {
    console.log(error)
    setSendOtpLoading(false)
  }
}

const verifyOtp =async()=>{
  setVerifyOtpLoading(true)
    try {
    const result =await axios.post('/api/delivery/otp/verify',{orderId:activeOrder.order._id,otp})
    console.log(result.data)
    setActiveOrder(null)
    setVerifyOtpLoading(false)
    await fetchCurrentOrder()
    window.location.reload()
  } catch (error) {
    setOtpError("Invalid OTP")
    setVerifyOtpLoading(false)
  }
}

if(!activeOrder && assignments.length ==0){
  const todayEarning=[
    {
      name:"Today",
      earning,
      deliveries:earning/40
    }
  ]
  return (
    <div className='flex items-center justify-center min-h-screen '>
      <div className='max-w-md w-full text-center'>
      <h2 className='text-2xl font-bold text-gray-800'>No Active Deliveries</h2>
      <p className='text-gray-500 mb-5'>Stay online to receive new orders</p>

      <div className='bg-white rounded-xl shadow-xl p-6 border'>
        <p className='font-medium mb-2'>Your Performance</p>

        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={todayEarning}>
                                
                                <XAxis dataKey="name" />
                                <YAxis/>
                                <Tooltip />
                                <Legend/>
                                <Bar dataKey="earnings" name={"Earnings"} />
                                <Bar dataKey="deliveries" name={"Deliveries"} />
        
                            </BarChart>
        
                        </ResponsiveContainer>
                        <p className='mt-4 text-lg font-bold'>{earning || 0} Earned today</p>
                        <button onClick={()=>window.location.reload()} className='mt-4 w-full bg-black text-white py-2 rounded-lg'>Refreash</button>
      </div>
      </div>
    </div>
  )
}

if(activeOrder && orderLocation){
  if (!userData?._id) return null
  return (
    <div className='p-4 pt-30 min-h-screen bg-gray-50'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-2xl font-bold mb-2'>Active Delivery</h1>
        <p className='text-sm mb-4'> order #{activeOrder.order._id.slice(-6)}</p>

        <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
          <LiveMap orderLocation={orderLocation} deliveryBoyLocation={deliveryBoyLocation}/>
        </div>
        <DeliveryboyChat orderId={activeOrder.order._id} deliveryBoyId={userData._id.toString()!}/>

        <div className='mt-6 bg-white rounded-xl shadow p-6 border'>
          {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
            <button onClick={sendOtp} className='w-full py-4 text-center bg-black text-white rounded-lg'>
              {sendOtpLoading?<Loader size={14} className='animate-spin text-center text-white'/>:"Mark as delivered"}</button>
          )}

          {
            showOtpBox && (<div className='mt-4'>
              <input type="text" className='w-full p-3 border rounded-lg text-center' placeholder='Enter otp' maxLength={4} onChange={(e)=>setOtp(e.target.value)} value={otp}/>
              <button onClick={verifyOtp} className='w-full mt-4 text-center bg-black text-white py-3 rounded-lg'>
                {verifyOtpLoading?<Loader size={14} className='animate-spin text-white text-center'/>:"Verify OTP"}</button>
              {otpError && <p className='text-red-500 mt-2 text-center'>{otpError}</p>}

            </div>)
          }

          {activeOrder.order.deliveryOtpVerification && (<p className='text-green-600 font-semibold text-center'>Order Delivered Successfully!</p>
          )}
          

        </div>

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