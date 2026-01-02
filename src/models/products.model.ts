import mongoose from "mongoose";

interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true},

    price: {
        type: Number,
        required: true},

    category: {
        type: String,
        enum: ["fruits", "vegetables", "dairy", "bakery", "beverages", "snacks", "household", "personal_care","skincare","beauty", "others","Electronics","Fashion","Home & Kitchen","Books","Sports","Toys","Beauty & Personal Care","Automotive","Grocery","Health"],
        required: true},

    imageUrl: {
        type: String,
        required: true},
        
    unit: {
        type: String,
        required: true,
        enum: ["kg", "g", "litre", "ml", "piece", "pack"]
    }


},{timestamps:true});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;