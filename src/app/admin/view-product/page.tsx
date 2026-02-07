"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Loader, Package, Pencil, Search, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/models/products.model'
import Image from 'next/image'


function ViewProduct() {
    const router=useRouter()
    const [products, setProducts]=useState<IProduct[]>()
    const [edit,setEdit]=useState<IProduct | null>(null)
    const [previewImage, setPreviewImage]=useState<string | null>(null)
    const [backendImage, setBackendImage]=useState<Blob | null>(null)
    const [loading, setLoading]=useState(false)
    const [deleteLoading, setDeleteLoading]=useState(false)
    const categories=["fruits", "vegetables", "dairy", "bakery", "beverages", "snacks", "household", "personal_care","skincare","beauty","Electronics","Fashion","Home & Kitchen","Books","Sports","Toys","Beauty & Personal Care","Automotive","Grocery","Health", "others"]

    const units=["kg", "g", "litre", "ml", "piece", "pack"]
    useEffect(()=>{
        const getProducts=async()=>{
            try {
                const result =await axios.get('/api/admin/get-products')
                setProducts(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getProducts()
    },[])
    
useEffect(()=>{
        if(edit){
            setPreviewImage(edit.imageUrl)
        }
    },[edit])

    const handleImage=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file=e.target.files?.[0]
        if(file){
            setBackendImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const handleEdit =async()=>{
        setLoading(true)
        if(!edit) return
        try {
            const formData =new FormData()
            formData.append("productId", edit._id?.toString() || "");
            formData.append("name", edit.name)
            formData.append("category", edit.category)
            formData.append("unit", edit.unit)
            formData.append("price", edit.price.toString())
            if(backendImage){
            formData.append("image", backendImage)
            }
            const result = await axios.post('/api/admin/edit-product',formData)
            setLoading(false)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete =async()=>{
        setDeleteLoading(true)
        if(!edit) return
        try {
            const result = await axios.post('/api/admin/delete-product',{productId:edit._id})
            setDeleteLoading(false)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div className='pt-4 w-[95%] md:w-[85%] mx-auto pb-20'>
        <motion.div
        initial={{opacity:0, x:-20}}
        animate={{opacity:1, x:0}}
        transition={{duration:0.4}}
        className='flex flex-col sm:flex-row items-center justify-between gap-3 font-medium sm:text-left text-center mb-6'
        >
            <button
            onClick={()=>router.push("/")}
            className='flex items-center justify-center gap-2 bg-black rounded-full text-white font-semibold px-4 py-2 w-full sm:w-auto'
            ><ArrowLeft size={18}/>Back</button>
            <h1 className='text-2xl md:text-3xl font-bold flex items-center justify-center gap-2'><Package size={28}/>Manage Products</h1>
        </motion.div>

        <motion.form
        initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.4}}
        className='flex items-center gap-3 bg-white rounded-full px-4 py-2 w-full max-w-md mx-auto shadow-md mb-6'
        >
            <Search className='text-gray-500 w-5 h-5 mr-2'/>
            <input placeholder='Search...' type="text" className='w-full text-gray-700 outline-none placeholder-gray-400'/>
        </motion.form>

        <div className='space-y-4'>
            {products?.map((product,index)=>(
                <motion.div
                key={index}
                whileHover={{scale:1.02}}
                transition={{type:"spring", stiffness:100}}
                className='bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4'

                >
                    <div className='relative w-full sm:w-44 aspect-square overflow-hidden border border-gray-200'>
                        <Image src={product.imageUrl} alt={product.name} fill className='object-cover hover:scale-100'/>
                    </div>

                    <div className='flex-1 w-full flex flex-col justify-between'>
                        <div>
                            <h3 className='font-semibold text-gray-800 text-lg truncate'>{product.name}</h3>
                            <p className='text-gray-500 text-sm capitalize'>{product.category}</p>
                        </div>

                        <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                            <p className='text-gray-800 font-bold text-lg'>Tk {product.price} /<span>{product.unit}</span></p>

                            <button onClick={()=>setEdit(product)} className='bg-black text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2'><Pencil size={15}/>Edit</button>
                        </div>
                    </div>

                </motion.div>
            
        ))}
        </div>

        <AnimatePresence>
            {edit && (
                <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                className='fixed inset-0 bg-black/40 flex itmes-center justify-center z-50 backdrop-blur-sm px-4'
                >
                    <motion.div
                    initial={{y:40, opacity:0}}
                    animate={{y:0, opacity:1}}
                    exit={{y:40, opacity:0}}
                    className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative'
                    >
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-2xl font-bold '>Edit Product</h2>
                            <button className='' onClick={()=>setEdit(null)}><X size={18}/></button>
                            
                        </div>

                        <div className='relative aspect-square group w-full h-48 rounded-lg overflow-hidden mb-4 border border-gray-200'>
                            {previewImage && <Image src={previewImage} alt={edit.name} fill className='object-cover'/>}
                            <label className='absolute inset-0 bg-black/40 opacity-0 flex justify-center items-center cursor-pointer group-hover:opacity-100' htmlFor="imageUpload"><Upload size={28} /></label>
                            <input onChange={handleImage} type="file" accept='image/*' hidden id='imageUpload' />
                           
                        </div>
                         <div className='space-y-4'>
                                <input
                                 placeholder='Enter product name'
                                 value={edit.name}
                                 onChange={(e)=>setEdit({...edit,name:e.target.value})}
                                 type="text"
                                  className='w-full border border-gray-300 rounded-lg p-2 outline-none'/>

                                  <select 
                                  value={edit.category}
                                  onChange={(e)=>setEdit({...edit,category:e.target.value})}
                                  className='w-full border border-gray-300 rounded-lg p-2 outline-none'>
                                    <option value="">Select Category</option>
                                    {categories.map((category,index)=>(
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                  </select>

                                  <input
                                 placeholder='Price'
                                 value={edit.price}
                                 onChange={(e)=>setEdit({...edit,price: Number(e.target.value)})}
                                 type="text"
                                  className='w-full border border-gray-300 rounded-lg p-2 outline-none'/>

                                   <select 
                                  value={edit.unit}
                                  onChange={(e)=>setEdit({...edit,unit:e.target.value})}
                                  className='w-full border border-gray-300 rounded-lg p-2 outline-none'>
                                    <option value="">Select Unit</option>
                                    {units.map((unit,index)=>(
                                        <option key={index} value={unit}>{unit}</option>
                                    ))}
                                  </select>

                            </div>

                            <div className='flex justify-end gap-3 mt-6'>
                            <button disabled={loading} onClick={handleEdit} className='px-2 py-1 rounded-lg bg-black text-white'>
                                {loading?<Loader size={14}/>:"Edit Product"}</button>
                            <button disabled={deleteLoading} onClick={handleDelete} className='px-2 py-1 rounded-lg bg-red-600 text-white'>
                                {deleteLoading?<Loader size={14}/>:"Edit Product"}</button>
                            </div>

                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>

    </div>
  )
}

export default ViewProduct