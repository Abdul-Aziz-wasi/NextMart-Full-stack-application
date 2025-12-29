import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import DeliveryboyDashboard from '@/components/DeliveryboyDashboard'
import EditRoleMobile from '@/components/EditRoleMobile'
import Navbar from '@/components/Navbar'
import UserDashboard from '@/components/UserDashboard'
import dbConnect from '@/lib/db'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

async function Page() {
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
  return (
    <>
      <Navbar user={plainUser}></Navbar>

      {user.role =="user" ? (<UserDashboard/>): user.role =="admin" ? (<AdminDashboard/>): <DeliveryboyDashboard/>}
    </>
  )
}

export default Page