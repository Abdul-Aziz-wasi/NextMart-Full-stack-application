"use client"
import axios from "axios"
import { Bike, User, UserCog } from "lucide-react"
import { motion } from "motion/react"
import { redirect } from "next/navigation"
import { useState } from "react"
function EditRoleMobile() {

    const [roles,setRoles]=useState([
        {id:"admin", label:"Admin", icon:UserCog},
        {id:"user", label:"User", icon:User},
        {id:"deliveryboy", label:"Delivery Boy", icon:Bike},
    ])

    const [selectedRole, setSelectedRole]=useState("")
    const [mobile,setMobile]=useState("")

   const handleRoleMobile =async()=>{
        try {
            const result =await axios.post("/api/user/edit-role-mobile",{
                role:selectedRole,
                mobile
            })
            redirect("/")
            
        } catch (error) {
            console.log(error)
        }
   }

  return (
    <motion.div
     initial={{y:-10, opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{duration:0.6}}
     className='flex flex-col min-h-screen items-center p-6 w-full'>
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mt-8">Select Your Role</h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10">
            {roles.map((role)=>{

                const Icon=role.icon
                const isSelected =selectedRole==role.id

                return(
                    <motion.div
                    whileTap={{scale:0.96}}
                    onClick={()=>setSelectedRole(role.id)}
                    key={role.id}
                    className={`flex flex-col items-center cursor-pointer justify-center w-48 h-44 rounded-2xl border  transition-all
                        ${isSelected ? "bg-white" : " hover:bg-white"}`}
                    >
                        <Icon/>
                    <span>{role.label}</span>
                    </motion.div>

                )
            })}
        </div>

        <div className="flex flex-col items-center mt-10">
            <label htmlFor="mobile" className="font-medium mb-2">Enter Your Mobile No.</label>

            <input
             type="tel"
             id="mobile" 
             placeholder="enter mobile number" 
             className="w-64 md:w-80 px-4 py-3 rounded-xl border border-black focus:right-2 focus:outline-none bg-white"
             onChange={(e)=>setMobile(e.target.value)}
             />

        </div>
        <button

        disabled={!selectedRole || mobile.length !== 11}
         className={` font-semibold mt-12 py-2 px-4 rounded shadow
               sm:py-3 sm:px-6
               w-full sm:w-auto
               focus:outline-none
               ${selectedRole && mobile.length == 11 
                ? "bg-black text-white cursor-pointer" : "bg-gray-200 cursor-not-allowed"
               }
               `} onClick={handleRoleMobile}>Next</button>

    </motion.div>
  )
}

export default EditRoleMobile