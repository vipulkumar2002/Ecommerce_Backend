import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./services/mongoDB/connectDB";
dotenv.config("./.env");

const app = express();

// console.log(process.env.PORT);

const PORT = process.env.PORT || 8000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is listen at Port ${PORT}`);
});
