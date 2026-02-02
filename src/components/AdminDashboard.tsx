import React from 'react'
import AdminDashboardClient from './AdminDashboardClient'
import dbConnect from '@/lib/db'
import Order from '@/models/order.model'
import User from '@/models/user.model'
import Product from '@/models/products.model'

async function AdminDashboard() {
  await dbConnect()
  const order =await Order.find({})
  const user =await User.find({role:"user"})
  const product =await Product.find({})

 const totalOrders = order.length
 const totalUsers = user.length
 const pendingOrders = order.filter((ord) => ord.status === 'pending').length
 const totalRevenue = order.reduce((sum, ord) => (sum + ord.totalAmount || 0), 0)

 const today =new Date()
 const startOftoday =new Date(today)
 startOftoday.setHours(0,0,0,0)

 const sevenDaysAgo =new Date()
  sevenDaysAgo.setDate(today.getDate() -6)

  const todayOrders = order.filter((ord) =>  new Date(ord.createdAt) >= startOftoday)
  const todayRevenue = todayOrders.reduce((sum, ord) => (sum + ord.totalAmount || 0), 0)

  const sevenDaysOrders = order.filter((ord) => { new Date(ord.createdAt) >= sevenDaysAgo})
  const sevenDaysRevenue = sevenDaysOrders.reduce((sum, ord) => (sum + ord.totalAmount || 0), 0)

    const stats =[
        {title:"Total Orders", value:totalOrders},
        {title: "Total Users", value:totalUsers},
        {title:"Pending Orders", value:pendingOrders},
        {title:"Total Revenue", value:totalRevenue},
    ]

    const chartData =[]
    for(let i=6; i>=0; i--){
      const date =new Date()
      date.setDate(date.getDate() -i)
      date.setHours(0,0,0,0)

      const nextDay =new Date(date)
      nextDay.setDate(nextDay.getDate() +1)

      const orderCounts = order.filter((ord) => new Date(ord.createdAt) >= date && new Date(ord.createdAt) < nextDay).length

      chartData.push({
        day: date.toLocaleDateString('en-US',{weekday:'short'}),
        orders: orderCounts
      })
    }
 
  return (
    <>
    <AdminDashboardClient earnings={{today:todayRevenue,
    sevenDays:sevenDaysRevenue,
    total:totalRevenue}}
  stats={stats}
  chartData={chartData}
  />
    </>
  )
}

export default AdminDashboard