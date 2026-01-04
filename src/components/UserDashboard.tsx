import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import dbConnect from '@/lib/db'
import Product from '@/models/products.model'
import ProductsCard from './ProductsCard'



async function UserDashboard() {
  await dbConnect()
  const products = await Product.find({})
  const plainProducts = JSON.parse(JSON.stringify(products))
  return (
    <>
    <HeroSection/>
    <CategorySlider/>
    <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
      <h2 className='text-2xl md:text-3xl text-center font-semibold mt-8 mb-4'>All Products</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 '>
        {plainProducts.map((product:any)=>(
      <ProductsCard key={product._id} product={product}/>))}
      </div>
    </div>
    
    
    </>
  )
}

export default UserDashboard