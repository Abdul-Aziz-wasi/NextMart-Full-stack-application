"use client"
import { getSocket } from '@/lib/socket'
import React, { useEffect } from 'react'

function GeoUpdater({userId}:{userId:string}) {
    const socket = getSocket()
    socket.emit("identity", userId)
    useEffect(()=>{
        if(!userId) return
        if(!navigator.geolocation) return
            const watcher =navigator.geolocation.watchPosition((position)=>{
                const latitude = position.coords.latitude
                const longitude =position.coords.longitude
                socket.emit("update-location",{
                    userId,
                    longitude:longitude,
                    latitude:latitude
                    
                })
            },(error)=>{
                console.log(error)
            },
            {enableHighAccuracy:true}
        )
            return ()=>navigator.geolocation.clearWatch(watcher)
    },[userId])
  return null
}

export default GeoUpdater