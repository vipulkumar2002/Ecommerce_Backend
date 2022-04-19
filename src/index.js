import express from "express";
import dotenv from "dotenv";
dotenv.config("./.env");

const app = express();

// console.log(process.env.PORT);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listen al Port ${PORT}`);
});
