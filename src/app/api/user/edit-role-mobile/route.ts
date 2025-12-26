import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
try {
    await dbConnect()
    const {role,mobile}=await req.json()
    const session = await auth()
    const user = await User.findOneAndUpdate({email:session?.user?.email},{mobile,role},{new:true})

    if(!user){
        return NextResponse.json(
            {message:"user not found"},
            {status:400}
        )
    }
    return NextResponse.json(
            user,
            {status:200}
        )
} catch (error) {
     return NextResponse.json(
            {message:`edit mobile and role error ${error}`},
            {status:500}
        )
}
}