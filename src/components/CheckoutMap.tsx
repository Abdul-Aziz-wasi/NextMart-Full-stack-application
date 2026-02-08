"use client"
import React, { useEffect } from 'react'
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'

const markerIcon =new L.Icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/128/447/447031.png",
    iconSize:[40,40],
    iconAnchor:[20,40]
})

type props={
positions:[number,number],
setPositions:(pos:[number,number])=>void
}

function CheckoutMap({positions,setPositions}:props) {
     const DragableMarker:React.FC=()=>{
            const map =useMap()
    
            useEffect(()=>{
                map.setView(positions as LatLngExpression,15,{animate:true})
            },[positions,map])
    
            return  <Marker icon={markerIcon}
                                     position={positions as LatLngExpression}
                                     draggable={true}
                                     eventHandlers={{
                                        dragend:(e:L.LeafletEvent)=>{
                                            const marker = e.target as L.Marker
                                           const {lat, lng}= marker.getLatLng()
                                           setPositions([lat, lng])
                                        }
                                     }}
                                     />
        }
  return (
     <MapContainer center={positions as LatLngExpression} zoom={13} scrollWheelZoom={true} className='w-full h-full'>
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                          <DragableMarker />     
                        </MapContainer>
  )
}

export default CheckoutMap