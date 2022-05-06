import express from "express";
const router = express.Router();
import { body, validationResult } from "express-validator";
import { isAdmin } from "../services/middlewares/isAdmin";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { Category } from "../services/mongoDB/models/Category";

/*
type : POST
path : category/add
body : {name,description}
query: none
description : Route to add a catagory
*/

router.post(
  "/add",
  isAdmin,
  isAuthenticated,
  body("name").isLength({ min: 3 }),
  body("description").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      if (errors.length > 0)
        return res.json({
          data: {
            category: null,
          },
          success: false,
          message: "Validation Failed",
        });

      console.log(req.user);
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();

      return res.json({
        data: {
          category,
        },
        success: true,
        message: "Category added",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          user: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : GET
path : category/all
body : none
query: none
description : Route to fetch all catagories
*/

router.get("/all", async (req, res) => {
  try {
    const catagories = await Category.find({});
    return res.json({
      data: {
        catagories,
      },
      success: true,
      message: "Catagories fetched",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        catagories: [],
      },
      success: false,
      message: error.message,
    });
  }
});
export default router;
