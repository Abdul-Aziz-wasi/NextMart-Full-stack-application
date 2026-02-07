import Product from "@/models/products.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const groceries =await Product.find({})
        return NextResponse.json(groceries,{status:200})
    } catch (error) {
        return NextResponse.json({message:`get products failed ${error}`},{status:500})
    }
    
}