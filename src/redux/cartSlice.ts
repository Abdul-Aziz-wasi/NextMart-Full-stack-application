import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  unit: string;
  quantity:number;
  createdAt?: Date;
  updatedAt?: Date;
}



interface ICartSlice{
    cartData:IProduct[]
}

const initialState:ICartSlice ={
   cartData:[]
}

const cartSlice =createSlice({
    name:'cart',
    initialState,
    reducers:{
       addToCart:(state,action:PayloadAction<IProduct>)=>{
        state.cartData.push(action.payload)
       },
       increaseQuantity:(state, action:PayloadAction<mongoose.Types.ObjectId>)=>{
            const items =state.cartData.find(item=>item._id==action.payload)
            if(items){
                items.quantity = items.quantity + 1;
            }
       },
       decreaseQuantity:(state, action:PayloadAction<mongoose.Types.ObjectId>)=>{
        const items =state.cartData.find(item=>item._id==action.payload)

        if(items?.quantity && items.quantity > 1){
            items.quantity = items.quantity - 1
        }
        else{
           state.cartData = state.cartData.filter(item=>item._id !== action.payload)
        }
       }
    }
})
export const {addToCart,increaseQuantity,decreaseQuantity} = cartSlice.actions
export default cartSlice.reducer