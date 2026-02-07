import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/products.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session =await auth()
        if(session?.user?.role !=="admin"){
           return NextResponse.json(
            {message:"You are not admin"},
             {status:400}
           )
        }

        const {productId}=await req.json()
        const productData = await Product.findByIdAndDelete(productId) 
        return NextResponse.json(
             productData,
             {status:200}
           )
        

    } catch (error) {
        return NextResponse.json(
            {message:`Error delete product: ${error}`},
             {status:500}
           )
    }

}