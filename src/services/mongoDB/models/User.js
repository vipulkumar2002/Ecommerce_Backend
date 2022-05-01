import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0, // 0 for non prevelised & 1 for admin
    },
    addresses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address",
      },
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = new mongoose.model("User", UserSchema);
