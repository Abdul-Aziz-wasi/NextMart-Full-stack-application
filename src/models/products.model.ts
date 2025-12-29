import mongoose from "mongoose";

interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  unit: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}