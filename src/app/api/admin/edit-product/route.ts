import { auth } from "@/auth";
import upLoadImageOnCloudinary from "@/lib/cloudinary";
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

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const productId = formData.get("productId") as string;
        const category = formData.get("category") as string;
        const price =formData.get("price") as string;
        const unit = formData.get("unit") as string;
        const file = formData.get("image") as Blob | null;

        let imageUrl
        if(file){
            imageUrl = await upLoadImageOnCloudinary(file)
        }

        const productData = await Product.findByIdAndUpdate(productId, {name,category,price,unit,imageUrl}) 
        return NextResponse.json(
             productData,
             {status:200}
           )
        

    } catch (error) {
        return NextResponse.json(
            {message:`Error edit product: ${error}`},
             {status:500}
           )
    }

}