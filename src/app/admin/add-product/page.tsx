"use client"
import { ArrowLeft, Loader, PlusCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import axios from 'axios'




function AddProduct() {

    const [name, setName]=useState("")
    const [category, setCategory]=useState("")
    const [unit, setUnit]=useState("")
    const [price, setPrice]=useState("")
    const [loading, setLoading]=useState(false)
    const [frontImage, setFrontImage]=useState<string | null>(null)
    const [backendImage, setBackendImage]=useState<File | null>(null)

    const categories=["fruits", "vegetables", "dairy", "bakery", "beverages", "snacks", "household", "personal_care","skincare","beauty","Electronics","Fashion","Home & Kitchen","Books","Sports","Toys","Beauty & Personal Care","Automotive","Grocery","Health", "others"]
    
    const units=["kg", "g", "litre", "ml", "piece", "pack"]

    const handleImageChange=(e:ChangeEvent<HTMLInputElement>)=>{
        const files=e.target.files
        if(!files || files.length===0)return;
        const file=files[0]
        setBackendImage(file)
        setFrontImage(URL.createObjectURL(file))
    }

    const handleSubmit=async(e:FormEvent)=>{
        e.preventDefault()
        setLoading(true)
        try {
            const formData =new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("unit", unit)
            formData.append("price", price)
            if(backendImage){
            formData.append("image", backendImage)
            }

            const result =await axios.post("/api/admin/add-product", formData)
            console.log(result.data);
            setLoading(false)
        } catch (error) {
            console.log("Error adding product:", error);
            
        }
    }


  return (
    <div className='min-h-screen flex relative items-center justify-center px-4 '>
        <Link href={"/"} className='absolute top-6 left-5 flex items-center gap-2 font-semibold py-2 px-3 rounded-full bg-black hover:bg-gray-600 text-white'><ArrowLeft className='w-5 h-5'/><span className='hidden md:flex'>Back to Home</span>
        </Link>

        <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.3}}
        className='bg-white w-full max-w-2xl shadow-2xl rounded-3xl p-8'>

            <div className='flex flex-col items-center mb-8'>
                <div className='flex items-center gap-3 text-center'>
                <PlusCircle className='h-8 w-8'/>
                <h2 className='text-2xl font-semibold mb-2'>Add New Product</h2>
                </div>
                <p className='text-gray-600 text-center'>Fill in the details below to add a new product to the store.</p>
                </div>

                <form className='flex flex-col gap-6 w-full' onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className='block font-medium mb-1'>Product Name <span className='text-red-600'>*</span></label>
                        <input type="text" id="name" placeholder='eg: perfum,milk...'
                        onChange={(e)=>setName(e.target.value)} 
                        value={name}
                        className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 '/>
                    </div>

                    {/* Category */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        <div className=''>
                        <label htmlFor="" className='block font-medium mb-1'>Categories <span className='text-red-600'>*</span></label>
                        <select name="category"
                        value={category}
                        onChange={(e)=>setCategory(e.target.value)}
                        className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none tramsition-all'>
                        <option value="">Select category</option>
                        {categories.map((category,idx)=>(
                        <option value={category} key={idx}>{category}</option>
                        ))}
                        </select>
                        </div>

                        {/* Units */}
                        <div>
                        <label htmlFor="" className='block font-medium mb-1'>Units <span className='text-red-600'>*</span></label>
                        <select name="unit"
                        value={unit}
                        onChange={(e)=>setUnit(e.target.value)}
                        className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none'>
                        <option value="">Select Unit</option>
                        {units.map((unit,idx)=>(
                                <option value={unit} key={idx}>{unit}</option>
                        ))}
                        </select>
                        </div>

                        {/* Product Price */}
                        <div>
                        <label htmlFor="name" className='block font-medium mb-1'>Product Price <span className='text-red-600'>*</span></label>
                        <input type="text" id="name" placeholder='eg: 120'
                        value={price}
                        onChange={(e)=>setPrice(e.target.value)}
                        className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 '/>
                    </div>
                    </div>

                    {/* Product Images */}
                    <div className='flex flex-col gap-3 sm:flex-row items-center'>
                        <label htmlFor="image"  className='cursor-pointer flex items-center justify-center gap-2 font-semibold w-full sm:w-auto py-3 hover:bg-gray-200 border rounded-lg p-2'> <Upload className='h-5 w-5'/> Upload image <span className='text-red-600'>*</span></label>
                        <input type="file" accept='image' hidden id='image' onChange={handleImageChange}/>

                        {frontImage &&
                         <Image width={100} height={100} src={frontImage} alt='image' className='rounded-xl p-2 shadow-md border border-gray-200 object-cover'/>}
                    </div>

                    <motion.button
                    whileHover={{scale:1.04}}
                    whileTap={{scale:0.9}}
                    disabled={loading}
                    className='mt-4 w-full cursor-pointer bg-black text-white font-semibold py-2 rounded-lg disable:opacity-60 flex items-center justify-center gap-3'
                    >{loading?<Loader className='w-5 h-5 animate-spin'/>:"Save Product"}

                    </motion.button>

                </form>
        </motion.div>
         </div>
  )
}

export default AddProduct