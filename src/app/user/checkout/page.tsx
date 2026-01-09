"use client"
import React, { useEffect, useState } from 'react'
import {motion} from "motion/react"
import { ArrowLeft, Building, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import axios from 'axios'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

const markerIcon =new L.Icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/128/447/447031.png",
    iconSize:[40,40],
    iconAnchor:[20,40]
})
function Checkout() {
    const router =useRouter()
    const {userData}=useSelector((state:RootState)=>state.user)
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

    const handleSearchQuery =async()=>{
        setSearchLoading(true)
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
             }),(error)=>{console.log('location error', error)},{enableHighAccuracy:true, maximumAge:0, timeout:600000})
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

    const DragableMarker:React.FC=()=>{
        const map =useMap()

        useEffect(()=>{
            map.setView(positions as LatLngExpression,15,{animate:true})
        },[positions,map])

        return  <Marker icon={markerIcon}
                                 position={positions as LatLngExpression}
                                 draggable={true}
                                 eventHandlers={{
                                    dragend:(e:L.LeafletEvent)=>{
                                        const marker = e.target as L.Marker
                                       const {lat, lng}= marker.getLatLng()
                                       setPositions([lat, lng])
                                    }
                                 }}
                                 />
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
                           {positions &&
                            <MapContainer center={positions as LatLngExpression} zoom={13} scrollWheelZoom={true} className='w-full h-full'>
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                          <DragableMarker />     
                        </MapContainer>}
                        
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
         </div>
    </div>
  )
}

export default Checkout