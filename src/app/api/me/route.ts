import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if(!session?.user || !session){
            return NextResponse.json(
                {message:"user is not authorized"}, {status:400}
            )
        }
        const user = await User.findOne({email:session.user.email}).select("-password");
        if(!user){
            return NextResponse.json(
                {message:"User not found"}, {status:404}
            )
        }

        return NextResponse.json(
            user,
            {status:200}
        )

    } catch (error) {
        return NextResponse.json(
            {message:`Internal Server Error ${error}`}, {status:500}
        )
    }
    
}