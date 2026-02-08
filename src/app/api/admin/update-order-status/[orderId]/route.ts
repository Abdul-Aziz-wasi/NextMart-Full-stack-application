import dbConnect from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, context: { params: Promise<{ orderId: string; }>; }) {
    try {
        await dbConnect()
        const {orderId}= await context.params
        const {status}= await req.json()
        const order =await Order.findById(orderId).populate("user")

        if(!order){
            return NextResponse.json(
                {message:"order not found"},
                {status:400}
            )
        }
        order.status = status
        let deliveryBoysPayload:unknown[] = []
        if(status === "out of delivery" && !order.assignment){
            const {latitude,longitude}=order.address
            const nearByDeliveryBoys =await User.find({
                role:"deliveryboy",
                location:{
                    $near:{
                        $geometry:{type:"Point",coordinates:[Number(longitude),Number(latitude)]},
                        $maxDistance:10000
                    }
                }
            })
            const nearByIds =nearByDeliveryBoys.map((boys)=>boys._id)
            const busyIds =await DeliveryAssignment.find({
                assignedTo:{$in:nearByIds},
                status:{$nin:["broadcasted" , "completed"]}
            }).distinct("assignedTo")
            const busyIdSet = new Set(busyIds.map(bId=>String(bId)))
            const availableDeliveryBoys =nearByDeliveryBoys.filter(
                boys=>!busyIdSet.has(String(boys._id))
            )
            const canditates =availableDeliveryBoys.map(boys=>boys._id)
            if(canditates.length == 0){
                await order.save()

                await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})

                return  NextResponse.json(
                {message:"delivery boys not available"},
                {status:200}
            )
            }

            const deliveryAssignment =await DeliveryAssignment.create({
                order:order._id,
                broadCastedTo:canditates,
                status:"broadcasted"
            })
            await deliveryAssignment.populate("order")
            for(const boyId of canditates){
                const boy =await User.findById(boyId)
                if(boy.socketId){
                    await emitEventHandler("new-assignment",deliveryAssignment,boy.socketId)
                }
            }



            order.assignment=deliveryAssignment._id
            deliveryBoysPayload =availableDeliveryBoys.map(boys=>({
                id:boys._id,
                name:boys.name,
                mobile:boys.mobile,
                latitude:boys.location.coordinates[1],
                longitude:boys.location.coordinates[0]
            }))
            await deliveryAssignment.populate("order")
        }
        await order.save()
        await order.populate("user")
         await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})

        return NextResponse.json({
            assignment:order.assignment?._id,
            availableBoys:deliveryBoysPayload
        },{status:200})
    } catch (error) {
        return NextResponse.json(
            {message:`update status error ${error}`},
            {status:500})
    }
}