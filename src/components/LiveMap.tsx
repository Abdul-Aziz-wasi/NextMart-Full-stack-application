
import React, { useEffect } from 'react'
interface ILocation{
  latitude:number
  longitude:number
}

interface IProp{
    orderLocation:ILocation
    deliveryBoyLocation:ILocation
}
import L, { LatLngExpression } from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

function Recenter({positions}:{positions:[number,number]}) {
    const map =useMap()

    useEffect(()=>{
        if(positions[0]!==0 && positions[1]!==0){
            map.setView(positions,map.getZoom(),{
                animate:true
            })
        }

    },[positions,map])
}
function LiveMap({orderLocation,deliveryBoyLocation}:IProp) {
    const deliveryBoyIcon =L.icon({
        iconUrl:"https://cdn-icons-png.flaticon.com/128/9561/9561839.png",
        iconSize:[45,45]
    })

     const userIcon =L.icon({
        iconUrl:"https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
        iconSize:[45,45]
    })

    const linePositions =deliveryBoyLocation && orderLocation 
    ?
    [
        [orderLocation.latitude,orderLocation.longitude],
        [deliveryBoyLocation.latitude,deliveryBoyLocation.longitude]
    ]:[]


    const center =[orderLocation.latitude,orderLocation.longitude]

  return (
    <div className='w-full h-125 rounded-xl overflow-hidden shadow relative z-2'>
         <MapContainer center={center as LatLngExpression} zoom={13} scrollWheelZoom={true} className='w-full h-full'>
            <Recenter positions={center as any}/>   
                                <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Marker position={[orderLocation.latitude,orderLocation.longitude]} icon={userIcon}>
                                    <Popup>Delivery address</Popup>
                                </Marker>

                                {deliveryBoyLocation && 
                                
                                <Marker position={[ deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}><Popup>Delivery boy</Popup>
                                </Marker>}

                                <Polyline positions={linePositions as any}/>
                                      
                                </MapContainer>
   </div>
  )
}

export default LiveMap