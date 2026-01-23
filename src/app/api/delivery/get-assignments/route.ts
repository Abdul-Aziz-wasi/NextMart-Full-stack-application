import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect()
        const session = await auth()
        const assignments =await DeliveryAssignment.find({
            broadCastedTo:session?.user?.id,
            status:"broadcasted"
        }).populate("order")
        return NextResponse.json(
            assignments,{status:200}
        )
    } catch (error) {
        return NextResponse.json(
           {message:`get assignment error ${error}`},{status:200}
        )
    }
}