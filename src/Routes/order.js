import express from "express";
const router = express.Router();

import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";

import { Order, User } from "../services/mongoDB/Schema";

/*
type : GET
path : order/all
body : none
query: none
description : Route to fetch all Orders
*/

//! admin route
router.get("/all", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.json({
      data: {
        orders,
      },
      success: true,
      message: "Orders fetched",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        orders: [],
      },
      success: false,
      message: error.message,
    });
  }
});

/*
type : GET
path : order/all
body : none
query: none
description : Route to fetch all Orders
*/

//! user route
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.json({
      data: {
        orders,
      },
      success: true,
      message: "Orders fetched",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        orders: [],
      },
      success: false,
      message: error.message,
    });
  }
});

export default router;
