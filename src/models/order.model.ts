import mongoose from "mongoose"

export interface IOrder{
    _id?:mongoose.Types.ObjectId
    user:mongoose.Types.ObjectId
    items:[
        {
            grocery:mongoose.Types.ObjectId
            name:string
            price:string
            image:string
            unit:string
            quantity:number
        }
    ]
    isPaid:boolean
    totalAmount:number
    paymentMethod:"cod" | "online"
    address:{
        fullName:string
        mobile:string
        city:string
        state:string
        division:string
        pinCode:string
        fullAddress:string
        latitude:number
        longitude:number
    }
    status:"pending" | "out of delivery" | "delivered"
    createdAt:Date
    updatedAt:Date
}



const orderSchema =new mongoose.Schema<IOrder>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            grocery:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Grocery",
            require:true
        },
        name:String,
        price:String,
        image:String,
        unit:String,
        quantity:Number,
        },
        
    ],
    paymentMethod:{
        type:String,
        enum:["cod" , "online"],
        default:"cod"
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    totalAmount:Number,
    address:{
        fullName:String,
        mobile:String,
        city:String,
        state:String,
        division:String,
        pinCode:String,
        fullAddress:String,
        latitude:Number,
        longitude:Number

    },
    status:{
        type:String,
        enum:["pending" , "out of delivery" , "delivered"],
        default:"pending"
    }
},{timestamps:true})

const Order =mongoose.models.Order || mongoose.model("Order", orderSchema)
export default Order