import express from "express";
import dotenv from "dotenv";

//import Router
import userRouter from "./Routes/user";

import { connectDB } from "./services/mongoDB/connectDB";
dotenv.config("./.env");

const app = express();

//middelware
//bodyParser
app.use(express.json());

// console.log(process.env.PORT);

const PORT = process.env.PORT || 8000;
connectDB();

// Route
app.use("/user", userRouter);
app.listen(PORT, () => {
  console.log(`Server is listen at Port ${PORT}`);
});
