import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import DeliveryBoy from '@/components/DeliveryBoy'
import EditRoleMobile from '@/components/EditRoleMobile'
import Footer from '@/components/Footer'
import GeoUpdater from '@/components/GeoUpdater'
import Navbar from '@/components/Navbar'
import UserDashboard from '@/components/UserDashboard'
import dbConnect from '@/lib/db'
import Product, { IProduct } from '@/models/products.model'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

async function Home(props:{
  searchParams:Promise<{
    q:string
  }>
}) {
  const searchParams =await props.searchParams
  console.log(searchParams)
  await dbConnect()

  const session = await auth()
  const user = await User.findById(session?.user?.id)

  if(!user){
    redirect("/login")
  }
  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role =="user")

  if(inComplete){
    return <EditRoleMobile/>
  }

  const plainUser =JSON.parse(JSON.stringify(user))

  let productList:IProduct[]=[]
  if(user.role==="user"){
    if(searchParams.q){
      productList= await Product.find({
        $or:[
          {name: {$regex: searchParams?.q || "", $options:"i"}},
          {category: {$regex: searchParams?.q || "", $options:"i"}}
        ]
      })
    }else{
      productList=await Product.find({}).lean()
    }
  }
  return (
    <>
      <Navbar user={plainUser}></Navbar>
      <GeoUpdater userId={plainUser._id}/>

      {user.role =="user" ? (<UserDashboard productList={productList}/>): user.role =="admin" ? (<AdminDashboard/>): <DeliveryBoy/>}
      <Footer/>
    </>
  )
}

export default Home