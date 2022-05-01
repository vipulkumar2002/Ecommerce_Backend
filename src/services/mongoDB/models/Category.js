import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = new mongoose.model("Category", CategorySchema);
// module.exports = mongoose.model("Category", CategorySchema);
