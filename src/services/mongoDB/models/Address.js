import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    houseNumber: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 100,
    },
    landmark: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = new mongoose.model("Address", AddressSchema);

export default Address;
