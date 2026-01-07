import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IProduct {
  _id: mongoose.Types.ObjectId;
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
    cartData:IProduct[],
    subTotal:number,
    deliveryFee:number,
    finalTotal:number
}

const initialState:ICartSlice ={
   cartData:[],
   subTotal:0,
   deliveryFee:40,
   finalTotal:40
}

const cartSlice =createSlice({
    name:'cart',
    initialState,
    reducers:{
       addToCart:(state,action:PayloadAction<IProduct>)=>{
        state.cartData.push(action.payload)
        cartSlice.caseReducers.calculateTotal(state)
       },
       increaseQuantity:(state, action:PayloadAction<mongoose.Types.ObjectId>)=>{
            const items =state.cartData.find(item=>item._id==action.payload)
            if(items){
                items.quantity = items.quantity + 1;
            }
            cartSlice.caseReducers.calculateTotal(state)
       },
       decreaseQuantity:(state, action:PayloadAction<mongoose.Types.ObjectId>)=>{
        const items =state.cartData.find(item=>item._id==action.payload)

        if(items?.quantity && items.quantity > 1){
            items.quantity = items.quantity - 1
        }
        else{
           state.cartData = state.cartData.filter(item=>item._id !== action.payload)
        }
        cartSlice.caseReducers.calculateTotal(state)
       },
       removeFromCart:(state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
        state.cartData = state.cartData.filter(item=>item._id !== action.payload)
        cartSlice.caseReducers.calculateTotal(state)
       },
       calculateTotal:(state)=>{
        state.subTotal = state.cartData.reduce((sum,itme)=>sum + Number(itme.price)*itme.quantity,0)
        state.deliveryFee = state.subTotal > 100 ? 0 : 40
        state.finalTotal =state.subTotal + state.deliveryFee
       }
    }
})
export const {addToCart,increaseQuantity,decreaseQuantity,removeFromCart} = cartSlice.actions
export default cartSlice.reducer