import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./services/mongoDB/connectDB";
dotenv.config("./.env");

//import Router
import userRoutes from "./Routes/user";
import categoryRoutes from "./Routes/category";
import productRoutes from "./Routes/product";
import addressRoutes from "./Routes/address";
import orderRoutes from "./Routes/order";

const app = express();

// console.log(process.env.PORT);
const PORT = process.env.PORT || 8080;

connectDB();

// ****************** Route -- start *************************

app.get("/", (req, res) => {
  res.send(`Server is deployed at post : ${PORT}`);
});

app.get("/getenvs", (req, res) => {
  res.send(process.env);
});

//middelware
//bodyParser
app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/address", addressRoutes);
app.use("/order", orderRoutes);

// ******************* Route -- end **************************

app.listen(PORT, () => {
  console.log(`Server is listen at Port ${PORT}`);
});
