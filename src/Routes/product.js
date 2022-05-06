import express from "express";
const router = express.Router();

import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";
import { body, validationResult } from "express-validator";
import { Product } from "../services/mongoDB/models/Product";

/*
type : POST
path : product/add
body : { name,
        description,
        stickerPrice,
        markedPrice,
        category,
        image,
        compatiblWith,
        stock,
        color}
query: none
description : Route to add a Product
*/
router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  body("name").isLength({ min: 3 }),
  body("description").isLength({ min: 5 }),
  body("stickerPrice").isNumeric({}),
  body("markedPrice").isNumeric({}),
  body("category").isLength({ min: 3 }),
  body("image").isLength({ min: 5 }),
  body("stock").isNumeric({}),
  body("color").isLength({ min: 3 }),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      if (errors.length > 0) {
        return res.json({
          data: {
            product: null,
          },
          success: false,
          message: "Validation Failed",
        });
      }
      const {
        name,
        description,
        stickerPrice,
        markedPrice,
        category,
        image,
        compatiblWith,
        stock,
        color,
      } = req.body;
      const product = new Product({
        name,
        description,
        stickerPrice,
        markedPrice,
        category,
        image,
        compatiblWith,
        stock,
        color,
      });
      await product.save();
      return res.json({
        data: {
          product,
        },
        success: true,
        message: "Product Added",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          product: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;
