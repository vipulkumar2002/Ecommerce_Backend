import express from "express";
const router = express.Router();

import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";
import { body, validationResult } from "express-validator";
import { Product } from "../services/mongoDB/Schema";

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

/*
type : GET
path : product/all
body : none
query: none
description : Route to fetched all Products
*/

router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    return res.json({
      data: {
        products,
      },
      success: true,
      message: "Product Fetched",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        products: [],
      },
      success: false,
      message: error.message,
    });
  }
});

/*
type : PUT
path : product/update/:id
body : none
query: none
description : Route to delete a Product
*/

router.put("update/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndUpdate({ _id: id });
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
});

/*
type : DETELE
path : product/:id
body : none
query: none
description : Route to delete a Product
*/

router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id });
    return res.json({
      data: {
        product,
      },
      success: true,
      message: "Product deleted",
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
});

export default router;
