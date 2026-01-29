import { getSocket } from '@/lib/socket'
import { IMessage } from '@/models/message.model'
import axios from 'axios'
import { Loader, Send, Sparkle } from 'lucide-react'
import  mongoose, { set }  from 'mongoose'
import { AnimatePresence, motion} from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'

type props = {
orderId:mongoose.Types.ObjectId,
deliveryBoyId:mongoose.Types.ObjectId
}

function DeliveryboyChat({orderId,deliveryBoyId}:props) {
    const [newMessage,setNewMessage]=useState("")
    const [messages,setMessages]=useState<IMessage[]>([])
    const chatBox=useRef<HTMLDivElement>(null)
    const [suggestions, setSuggestions] = useState([]);
    const [loading,setLoading]=useState(false)

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
            senderId:deliveryBoyId,
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
            const lastMessage =messages.filter(message=>message.senderId !== deliveryBoyId).at(-1)
            const result =await axios.post("/api/chat/ai-suggestions",{message:lastMessage?.text,role:"delivery_boy"})
            setSuggestions(result.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


  return (
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
                    className='px-3 py-2 text-xs bg-purple-700 cursor-pointer text-white  rounded-full'
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
                className={`flex ${message.senderId===deliveryBoyId ? 'justify-end':'justify-start' }`}
                >
                    <div className={`px-4 psy-2 max-w-[75%] rounded-2xl shadow
                    ${
                        message.senderId===deliveryBoyId
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
  )
}

export default DeliveryboyChat