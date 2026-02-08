"use client"
import React, { useEffect, useState } from 'react'
import {motion} from "motion/react"
import { ArrowLeft, Building, CreditCard, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, Truck, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

import axios from 'axios'
import dynamic from 'next/dynamic'

const CheckoutMap=dynamic(()=>import("@/components/CheckoutMap"),{ssr:false})



function Checkout() {
    const router =useRouter()
    const {userData}=useSelector((state:RootState)=>state.user)
    const {subTotal,deliveryFee,finalTotal, cartData}=useSelector((state:RootState)=>state.cart)
    const [address, setAddress]= useState({
        fullName: "",
        mobile:"",
        city:"",
        division:"",
        pinCode:"",
        fullAddress:""

    })


    const [positions, setPositions] =useState<[number,number] | null>(null)
    const[serachQuery, setSearchQuery]=useState("")
    const [searchLoading, setSearchLoading]=useState(false)
    const [paymentMethod, setPaymentMethod] =useState<"cod" | "online">("cod")

    const handleSearchQuery =async()=>{
        setSearchLoading(true)
        const {OpenStreetMapProvider}= await import("leaflet-geosearch")
        const provider =new OpenStreetMapProvider()
        const result = await provider.search({query: serachQuery})
        if(result){
            setSearchLoading(false)
            setPositions([result[0].y, result[0].x])
        }
    }

    useEffect(()=>{
        if(navigator.geolocation){
             navigator.geolocation.getCurrentPosition((position=>{
                const {latitude, longitude}= position.coords
                setPositions([latitude,longitude])
             }),(error)=>{console.log('location error', error)},{enableHighAccuracy:true, maximumAge:0, timeout:10000})
        }
    },[])

    useEffect(()=>{
        if(userData){
            setAddress((prev)=>({...prev,fullName:userData.name || ""}))
            setAddress((prev)=>({...prev,mobile:userData.mobile || ""}))
        }
    },[userData])

    useEffect(()=>{
        if(!positions) return
        const fetchAddress = async ()=>{
            try {
            const result =await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${positions[0]}&lon=${positions[1]}&format=json`)
            console.log(result.data)
            setAddress(prev=>({...prev,
                city:result.data.address.county,
                division:result.data.address.state,
                pinCode:result.data.address.country_code,
                fullAddress:result.data.display_name
            }))

            } catch (error) {
                console.log(error)
            }
        }
        fetchAddress()
    }, [positions])

   

    const handleCodOrder=async()=>{
        if(!positions){
            return null
        }
        try {
            const result = await axios.post("/api/user/order",{
                userId:userData?._id,
                items:cartData.map(item=>(
                    {
                        grocery:item._id,
                        name:item.name,
                        price:item.price,
                        unit:item.unit,
                        quantity:item.quantity,
                        image:item.imageUrl
                    }
                )),
                totalAmount :finalTotal,
                address:{
                    fullName:address.fullName,
                    mobile:address.mobile,
                    city:address.city,
                    division:address.division,
                    pinCode:address.pinCode,
                    fullAddress:address.fullAddress,
                    latitude:positions[0],
                    longitude:positions[1]
                },
                paymentMethod,
            })
            router.push("/user/order-successful")
        } catch (error) {
            console.log(error)
        }
    }

    const handleOnlinePayment=async()=>{
        if(!positions){
            return null
        }
        try {
            const result =await axios.post("/api/user/payment",{
                userId:userData?._id,
                items:cartData.map(item=>(
                    {
                        grocery:item._id,
                        name:item.name,
                        price:item.price,
                        unit:item.unit,
                        quantity:item.quantity,
                        image:item.imageUrl
                    }
                )),
                totalAmount :finalTotal,
                address:{
                    fullName:address.fullName,
                    mobile:address.mobile,
                    city:address.city,
                    division:address.division,
                    pinCode:address.pinCode,
                    fullAddress:address.fullAddress,
                    latitude:positions[0],
                    longitude:positions[1]
                },
                paymentMethod,
            })
            window.location.href=result.data.url
        } catch (error) {
            console.log(error)
        }
    }

    const handleCurrentLocation =()=>{
        if(navigator.geolocation){
             navigator.geolocation.getCurrentPosition((position=>{
                const {latitude, longitude}= position.coords
                setPositions([latitude,longitude])
             }),(error)=>{console.log('location error', error)},{enableHighAccuracy:true, maximumAge:0, timeout:600000})
        }
    }


  return (
    <div className='w-[92%] md:w-[80%] mx-auto py-10 relative'>
        <motion.button
        whileTap={{scale:0.97}}
        className='absolute left-0 top-2 flex items-center gap-2 font-semibold'
        onClick={()=>router.push("/user/cart")}
        > <ArrowLeft size={16}/> <span>Back to Cart</span></motion.button>

        <motion.h1
         initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.3}}
         className='text-3xl md:text-4xl font-bold text-center mb-10'>Checkout</motion.h1>

         <div className='grid md:grid-cols-2 gap-8'> 
            {/* Left content*/}
            <motion.div
            initial={{opacity:0, x:-20}}
            animate={{opacity:1, x:0}}
            transition={{duration:0.5}}
            className='bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 '
            >
                <h2 className='text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2'> <MapPin/> Delivery Address</h2>

                <div className='space-y-4'>
                    <div className='relative'>
                        <User size={18} className='absolute left-3 top-3'/>
                        <input type="text"  value={address.fullName} onChange={(e)=>setAddress((prev)=>({...prev,fullName:e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                    </div>

                       <div className='relative'>
                        <Phone size={18} className='absolute left-3 top-3'/>
                        <input type="text" value={address.mobile} onChange={(e)=>setAddress((prev)=>({...prev,mobile:e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                    </div>

                     <div className='relative'>
                        <Home size={18} className='absolute left-3 top-3'/>
                        <input type="text" placeholder='Full address' value={address.fullAddress} onChange={(e)=>setAddress((prev)=>({...prev,fullAddress:e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                    </div>

                    <div className='grid grid-cols-3 gap-3'>
                        <div className='relative'>
                        <Building size={18} className='absolute left-3 top-3'/>
                        <input type="text" placeholder='City..' value={address.city} onChange={(e)=>setAddress((prev)=>({...prev,city:e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                    </div>

                        <div className='relative'>
                        <Navigation size={18} className='absolute left-3 top-3'/>
                        <input type="text" placeholder='Division...' value={address.division} onChange={(e)=>setAddress((prev)=>({...prev,division:e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                       </div>

                        <div className='relative'>
                        <Search size={18} className='absolute left-3 top-3'/>
                        <input type="text" placeholder='pincode' value={address.pinCode} onChange={(e)=>setAddress((prev)=>({...prev,pinCode:e.target.value}))} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
                       </div>
                    </div>

                    <div className='flex gap-2 mt-3'>
                        <input type="text" className='flex-1 border rounded-lg p-3 text-sm outline-none' value={serachQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder='search city or area...'/>
                        <button onClick={handleSearchQuery} className='bg-black text-white px-5 rounded-lg font-medium'>
                            {searchLoading?<Loader2 size={16} className='animate-spin'/>:"Search"}
                        </button>
                    </div>

                    <div className='relative mt-6 h-82.5 rounded-xl overflow-hidden border border-gray-200 shadow-inner'>
                           {positions && <CheckoutMap positions={positions} setPositions={setPositions}/>
                           }
                        
                            <motion.button
                            whileTap={{scale:0.95}}
                            className='absolute bottom-4 right-4 shadow-lg rounded-full bg-white p-3 flex itmes-center justify-center z-999'
                            onClick={handleCurrentLocation}
                            >
                                <LocateFixed size={22}/>
                            </motion.button>
                    </div>

                </div>

            </motion.div>

            {/* Right Content*/}
            <motion.div
            initial={{opacity:0, x:20}}
            animate={{opacity:1, x:0}}
            transition={{duration:0.5}}
            className='bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 h-fit'
            >
                <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'><CreditCard /> Payment Method</h2>
                <div className='space-y-4 mb-6'>
                    <button
                    onClick={()=>setPaymentMethod("online")}
                    className={`flex items-center gap-3 w-full border rounded-lg p-3 ${paymentMethod === "online" ? "bg-black text-white shadow-sm" : "hover:bg-gray-50"}`}
                    ><CreditCard/> <span className='font-medium'>Pay Online (stripe)</span></button>

                    <button
                    onClick={()=>setPaymentMethod("cod")}
                    className={`flex items-center gap-3 w-full border rounded-lg p-3 ${paymentMethod === "cod" ? "bg-black text-white shadow-sm" : "hover:bg-gray-50"}`}
                    ><Truck/> <span className='font-medium'>Cash on Delivery</span></button>
                </div>

                <div className='border-t pt-4 font-semibold space-y-2 text-sm sm:text-base'>
                    <div className='flex justify-between'>
                        <span>Sub Total</span>
                        <span>{subTotal} tk</span>
                    </div>

                    <div className='flex justify-between'>
                        <span>Delivery Fee</span>
                        <span>{deliveryFee} tk</span>
                    </div>

                    <div  className='flex justify-between border-t '>
                        <span>Final Total</span>
                        <span>{finalTotal} tk</span>
                    </div>
                </div>

                <motion.button
                whileTap={{scale:0.95}}
                className='w-full mt-6 text-white py-3 bg-black rounded-full font-semibold'
                onClick={()=>{
                    if(paymentMethod === "cod"){
                        handleCodOrder()
                    }else{
                        handleOnlinePayment()
                        
                    }
                }}
                >
                    {paymentMethod ==="cod" ? "Place Order" : "Pay and Place Order"}
                </motion.button>

            </motion.div>
         </div>
    </div>
  )
}

export default Checkout