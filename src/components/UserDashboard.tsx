import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import dbConnect from '@/lib/db'
import  { IProduct } from '@/models/products.model'
import ProductsCard from './ProductsCard'



async function UserDashboard({productList}:{productList:IProduct[]}) {
  await dbConnect()
  const plainProduct =JSON.parse(JSON.stringify(productList))
  
  return (
    <>
    <HeroSection/>
    <CategorySlider/>
    <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
      <h2 className='text-2xl text-gray-700 md:text-3xl font-bold mb-6 text-center'> All Products</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 '>
        {plainProduct.map((product:any)=>(
      <ProductsCard key={product._id} product={product}/>))}
      </div>
    </div>
    
    
    </>
  )
}

export default UserDashboard