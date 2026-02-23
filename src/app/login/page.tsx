"use client"
import { EyeClosed, EyeIcon, Leaf, Loader2, Lock, Mail } from 'lucide-react'
import { motion } from "motion/react"
import Image from 'next/image'
import googleImage from '@/assets/googleicon.png'
import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'


function Login() {

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [showPassword, setShowPassword]=useState(false)
    const [loading, setLoading]=useState(false)
    const router = useRouter()
    const session =useSession()
    console.log(session)

    const handleSignin =async(e:FormEvent)=>{
        e.preventDefault()
        setLoading(true)
        try {
            await signIn("credentials",{
                email,password
                
            })
            router.push('/')
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)       
        }
    }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen px-6 py-10 relative'>

        <motion.h1
        initial={{y:-10, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{duration:0.6}}
         className='text-4xl font-extrabold mb-2'>Login to your Account</motion.h1>
         <motion.p
         initial={{y:-10, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{duration:0.6}}
          className='flex items-center mb-8 gap-2'>login Nextmart <Leaf className='h-5 w-5'/></motion.p>

          <motion.form 
          onSubmit={handleSignin}
           initial={{y:-10, opacity:0}}
           animate={{y:0, opacity:1}}
           transition={{duration:0.6}}
          className='flex flex-col w-full max-w-sm gap-5'>

                {/*Input Email */}
            {/* <div className='relative'>
                <Mail className='absolute left-3 top-3.5 w-5 h-5 '/>
                <input type="text" placeholder='Your Email' className='w-full pl-10 py-3 pr-4 focus:outline-none border border-black rounded-xl'
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                />
            </div> */}

                {/*Input Password */}
            {/* <div className='relative'>
                <Lock className='absolute left-3 top-3.5 w-5 h-5 '/>
                <input type={showPassword?"text":"password"} placeholder='Password' className='w-full pl-10 py-3 pr-4 focus:outline-none border border-black rounded-xl'
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
                />
                {showPassword?<EyeClosed onClick={(e)=>setShowPassword(false)} className='absolute right-3 top-3.5 h-5 w-5 cursor-pointer'/>:<EyeIcon onClick={(e)=>setShowPassword(true)} className='absolute right-3 top-3.5 h-5 w-5 cursor-pointer'/>}
            </div> */}

            {/*Input Button */}
            {/* {
                (()=>{
                    const formValildation = email !=="" && password !== ""
                    return <button
                     disabled={!formValildation || loading}
                      className={`w-full font-semibold py-3 rounded-xl shasow-md inline-flex items-center justify-center gap-2 
                        ${formValildation ? "bg-black text-white cursor-pointer hover:bg-gray-700" 
                        : "cursor-not-allowed bg-black text-white"}`}>
                            {loading ? <Loader2 className='w-5 h-5 animate-spin'/>:"Login"}</button>

                })()
            }

            <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
                <span className='flex-1 h-px bg-gray-400'></span>
                OR
                <span className='flex-1 h-px bg-gray-400'></span>
            </div> */}
            
            <div className='w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium border border-black hover:bg-gray-200 cursor-pointer' onClick={()=>signIn("google",{callbackUrl:"/"})}>
                <Image alt='' src={googleImage} width={20} height={20}/>
                Continue with Google
            </div>
          </motion.form>

          <motion.p
         initial={{y:-10, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{duration:0.6}} className='flex items-center text-sm mt-6 gap-1 cursor-pointer' onClick={()=>router.push('/register')}>Do not have account ? <span className='text-blue-600'>Sign up</span></motion.p>
        </div>
  )
}

export default Login