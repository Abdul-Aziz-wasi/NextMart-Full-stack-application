import React from 'react'
import DeliveryboyDashboard from './DeliveryboyDashboard'
import { auth } from '@/auth'
import dbConnect from '@/lib/db'
import Order from '@/models/order.model'

async function DeliveryBoy() {
  await dbConnect()
  const session =await auth()
  const deliveryBoyId =session?.user?.id
  const orders = await Order.find({
    assignedDeliveryBoy:deliveryBoyId,
    deliveryOtpVerification:true
  })

  const today = new Date().toDateString()

  const todayOrders =orders.filter((order)=>new Date(order.deliveredAt).toDateString()===today).length
  const todayEarnings =todayOrders * 40
  return (
    <>
    <DeliveryboyDashboard earning={todayEarnings}/>
    </>
  )
}

export default DeliveryBoy