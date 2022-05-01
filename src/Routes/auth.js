import express from "express";
import bcrypt from "bcryptjs";
import { validationResult, body } from "express-validator";
import { User } from "../services/mongoDB/models/User";
import JWT from "jsonwebtoken";
const router = express.Router();

/*
type : POST
path : /user/signup
body : {firstName,lastName,email,password}
query: none
description: Route to sign up a new user
*/

router.post(
  "/signup",
  //validation midleware
  body("firstName").isLength({ min: 1 }),
  body("lastName").isLength({ min: 1 }),
  body("password").isLength({ min: 3 }),
  body("email").isEmail(),

  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      if (errors.length > 0) {
        return res.json({
          data: {
            user: null,
          },
          success: false,
          message: "validation failed",
        });
      }

      const { firstName, lastName, email, password } = req.body;
      const salt = await bcrypt.genSalt(5);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      await user.save();
      console.log(user);
      return res.json({
        data: {
          user,
        },
        success: true,
        message: "User created Successfully ",
      });
    } catch (error) {
      res.json({
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
type : POST
path : /user/login
body : {email,password}
query: none
description: Route to log in a new user
*/

router.post(
  "/login",
  body("password").isLength({ min: 3 }),
  body("email").isEmail(),
  async (req, res) => {
    try {
      // const { errors } = validationResult(req);
      // if (errors.length > 0)
      //   return res.json({
      //     data: {
      //       token: null,
      //     },
      //     success: false,
      //     message: "validation failed",
      //   });

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.json({
          data: {
            token: null,
          },
          success: false,
          message: "User not found",
        });
      }

      const isVerified = await bcrypt.compare(password, user.password);
      if (!isVerified) {
        res.json({
          data: {
            token: null,
          },
          success: false,
          message: "User not Varified",
        });
      }

      // verified user create JWT
      const token = JWT.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.SECRET_JWT,
        { expiresIn: "24h" }
      );
      await user.save();
      return res.json({
        data: {
          token,
        },
        success: true,
        message: "User Loged in Successfully ",
      });
    } catch (error) {
      res.json({
        data: {
          token: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;
