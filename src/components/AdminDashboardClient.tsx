"use client"
import React, { useState } from 'react'
import {motion} from "motion/react"
import { IndianRupee, Key, Package, Truck, User } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

type propType={
   earnings:{today:number,
    sevenDays:number,
    total:number},
    stats: {
    title: string;
    value: number;
}[],
chartData: {
    day: string;
    orders: number;
}[]

}

function AdminDashboardClient({earnings,stats,chartData}:propType) {
    const [filter,setFilter]=useState<"today" | "sevenDays" | "total">()

    const currentEarnings = filter === "today" ? earnings.today : filter === "sevenDays" ? earnings.sevenDays : earnings.total

    const title = filter === "today" ? "Today's Earnings" : filter === "sevenDays" ? "Last 7 Days Earnings" : "Total Earnings"

  

  return (
    <div className='pt-28 w-[90%] md-w-[80%] mx-auto '>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 text-center sm:text-left'>
            <motion.h1
            initial={{opacity:0, y: 20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.5}}
            className='text-2xl md:text-3xl font-bold'
            >
                🏪 Admin Dashboard
            </motion.h1>
            <select className='border border-gray-300 rounded-md py-2 px-4 text-sm w-full sm:w-auto outline-none focus:ring-2 focus:ring-black'
            onChange={(e)=>setFilter(e.target.value as any)}
            value={filter}
            >
                <option value="total">Total</option>
                <option value="last 7 days">Last 7 days</option>
                <option value="today">Today</option>
                 </select>
            </div>

            <motion.div
            initial={{opacity:0, y:15}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.3}}
            className='bg-white shadow-md rounded-lg p-6 mb-10 text-center'
            >
                <h2 className='text-lg font-semibold mb-2'>{title}</h2>
                <p className='text-2xl font-bold'>{currentEarnings.toLocaleString()}Tk</p>

            </motion.div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10'>
                {stats.map((stat,index)=>{
                    const icons =[
                        <Package key="p" className='w-6 h-6'/>,
                        <User key="u" className='w-6 h-6'/>,
                        <Truck key="t" className='w-6 h-6'/>,
                        <IndianRupee key="i" className='w-6 h-6'/>
                         ]
                    return <motion.div
                    key={index}
                    initial={{opacity:0, y:15}}
                    animate={{opacity:1, y:0}}
                    transition={{duration:0.3, delay:index *0.1}}
                    className='bg-white border-gray-100 hover:shadow-lg shadow-md rounded-lg p-6 flex items-center gap-4'
                    >
                        <div className='bg-white p-3 rounded-xl'>
                         {icons[index]}
                        </div>

                        <div>
                            <p className='text-gray-600 text-sm'>{stat.title}</p>
                            <p className='text-2xl font-bold text-gray-800'>{stat.value}</p>
                        </div>



                    </motion.div>
                })}

            </div>

            <div className='bg-white border border-gray-100 rounded-2xl shadow-md p-5 mb-10'>
                <h2 className='text-lg font-semibold text-gray-700 mb-4'>Orders overview (lasat 7 days)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid stroke='#ccc' strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#8884d8" radius={[6,6,0,0]}/>

                    </BarChart>

                </ResponsiveContainer>

            </div>

    </div>
  )
}

export default AdminDashboardClient