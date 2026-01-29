"use client"
import LiveMap from '@/components/LiveMap'
import { getSocket } from '@/lib/socket'
import { IMessage } from '@/models/message.model'
import { IUser } from '@/models/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { ArrowLeft, Loader, Send, Sparkle } from 'lucide-react'
import mongoose from 'mongoose'
import { AnimatePresence, motion } from 'motion/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
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
  const [newMessage,setNewMessage]=useState("")
  const [messages,setMessages]=useState<IMessage[]>([])
  const router =useRouter()
   const [loading,setLoading]=useState(false)
  const chatBox=useRef<HTMLDivElement>(null)
   const [suggestions, setSuggestions] = useState([]);
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

 useEffect(():any=>{
        const socket =getSocket()
        socket.emit("join-room",orderId)
        socket.on("send-message",(message=>{
            if(message.roomId===orderId){
                setMessages((prevMessages)=>[...prevMessages,message])
            }
            
        }))
        return ()=>socket.off("send-message")
    },[])

    const sendMessage=()=>{
        const socket =getSocket()

        const message ={
            roomId:orderId,
            senderId:userData?._id,
            text:newMessage,
            time:new Date().toLocaleTimeString([],{
                hour:'2-digit',
                minute:'2-digit'
            })
        }
        socket.emit("send-message",message)
        
        setNewMessage("")
    }

     useEffect(()=>{
            chatBox.current?.scrollTo({
                top:chatBox.current.scrollHeight,
                behavior:"smooth"
            })
        },[messages])

 useEffect(()=>{
        const  getAllMessages=async()=>{
            try {
                const result = await axios.post("/api/chat/messages",{roomId:orderId})
                setMessages(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getAllMessages()
    },[])

     const getSuggestion=async()=>{
            setLoading(true)
            try {
                const lastMessage =messages.filter(message=>message.senderId !== userData?._id).at(-1)
                const result =await axios.post("/api/chat/ai-suggestions",{message:lastMessage?.text,role:"user"})
                setSuggestions(result.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }



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

        <div className='px-4 mt-6 space-y-4'>
          <div className='rounded-3xl overflow-hidden border shadow'>
            <LiveMap orderLocation={orderLocation} deliveryBoyLocation={deliveryBoyLocation}/>
            
          </div>


          <div className='bg-white rounded-3xl shadow-lg border p-4 flex flex-col h-110'>

            <div className='flex justify-between items-center mb-3'>
                        <span className='font-semibold text-gray-800 text-sm'>Quick Replies</span>
                        <motion.button
                        onClick={getSuggestion}
                        disabled={loading}
                        whileTap={{scale:0.9}}
                         className='px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200'><Sparkle size={14}/>{loading?<Loader className='w-5 h-5 animate-spin'/>:"Ai suggested"}</motion.button>
                         </div>
            
                         <div className='flex gap-2 flex-wrap mb-3'>
                            {suggestions.map((suggestion,index)=>(
                                <motion.div
                                whileTap={{scale:0.92}}
                                className='px-3 py-2 text-xs cursor-pointer bg-purple-700 text-white  rounded-full'
                                onClick={()=>setNewMessage(suggestion)}
                                 key={index}>
                                    {suggestion}
                                </motion.div>
                            ))}
                         </div>
          
                  <div className='flex-1 overflow-y-auto p-2 space-y-3' ref={chatBox}>
                      <AnimatePresence>
                       {messages.map((message,index)=>(
                          <motion.div
                          key={message._id?.toString()}
                          initial={{opacity:0, y:15}}
                          animate={{opacity:1, y:0}}
                          exit={{opacity:0}}
                          transition={{duration:0.3}}
                          className={`flex ${message.senderId===userData?._id ? 'justify-end':'justify-start' }`}
                          >
                              <div className={`px-4 psy-2 max-w-[75%] rounded-2xl shadow
                              ${
                                  message.senderId===userData?._id
                                  ? 'bg-black text-white rounded-br-none'
                                  : 'bg-gray-200 text-black rounded-bl-none'
                              }
                                  `}>
                                  <p>{message.text}</p>
                                  <p className='text-sm opacity-70 mt-1 text-right'>{message.time}</p>
                              </div>
                          </motion.div>
                      ))}
                      </AnimatePresence>
                     
          
                  </div>
          
                  <div className='flex gap-2 mt-3 border-t pt-3'>
              <input type="text" placeholder='type a Message...' className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none ' value={newMessage} onChange={(e)=>setNewMessage(e.target.value)}/>
              <button onClick={sendMessage} className='bg-black p-3 rounded-xl text-white'><Send size={18}/></button>
                  </div>
          
              </div>

        </div>

      </div>

    </div>
  )
}

export default TrackOrder