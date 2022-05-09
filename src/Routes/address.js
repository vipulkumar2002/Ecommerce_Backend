import express from "express";
const router = express.Router();

import { body, validationResult } from "express-validator";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { Address, User } from "../services/mongoDB/Schema";

/*
type : POST
path : address/add
body : { houseNumber, fullAddress, landmark}
query: none
description : Route to add a Address
*/
router.post(
  "/add",
  isAuthenticated,
  body("houseNumber").isLength({ min: 1 }),
  body("fullAddress").isLength({ min: 5 }),
  body("landmark").isLength({ min: 1 }),
  body("pincode").isPostalCode("IN"),

  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      if (errors.length > 0) {
        return res.json({
          data: {
            address: null,
          },
          success: false,
          message: "Validation Failed",
        });
      }
      const user = req.user;

      // Create the address doc
      const { houseNumber, fullAddress, landmark, pincode } = req.body;

      const address = new Address({
        user,
        houseNumber,
        fullAddress,
        landmark,
        pincode,
      });

      await address.save();

      //   Now that address is saved, modify it inside the user doc

      /*
      {Bad Approch}
      const previousAddress = await User.find({ _id: user }).addresses;
      previousAddress.push(address._id);

      await User.findOneAndUpdate(
        { _id: user },
        { addresses: previousAddress }
      );
      */

      await User.findOneAndUpdate(
        { _id: user },
        { $addToSet: { addresses: address._id } }
      );

      return res.json({
        data: {
          address,
        },
        success: true,
        message: "Address added",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          address: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : GET
path : address/all
body : none
query: none
description : Route to all a Addresses
*/

router.get("/all", async (req, res) => {
  try {
    const addresses = await Address.find({});
    return res.json({
      data: {
        addresses,
      },
      success: true,
      message: "Addresses fetched",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        addresses: null,
      },
      success: false,
      message: error.message,
    });
  }
});

/*
type : DELETE
path : address/:id
body : none
query: none
description : Route to delate a Address
*/

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOneAndDelete({ _id: id });
    return res.json({
      data: {
        address,
      },
      success: true,
      message: "Address deleted",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        address: null,
      },
      success: false,
      message: error.message,
    });
  }
});
export default router;
