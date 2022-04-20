import mongoose from "mongoose";

const ProductSchema = new mongoose.model(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    stickerPrice: {
      type: Number,
      required: true,
    },
    markedPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    image: {
      type: String,
      required: true,
    },
    compatiblWith: {
      type: String,
      enum: ["iPhone", "Mac", "Apple Watch", "Airpods"],
    },
    stock: {
      type: Number,
      default: 0,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = new mongoose.model("Product", ProductSchema);

export default Product;
