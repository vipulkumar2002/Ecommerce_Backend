import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    houseNumber: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    landmark: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Address = new mongoose.model("Address", AddressSchema);
