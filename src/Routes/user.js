import express from "express";
import bcrypt from "bcryptjs";
import { validationResult, body } from "express-validator";
import { User } from "../services/mongoDB/models/User";
import { signJWT, verifyJWT } from "../utils/index";
import { isAdmin } from "../services/middlewares/isAdmin";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";

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
  body("firstName").isLength({ min: 3 }),
  body("lastName").isLength({ min: 3 }),
  body("password").isLength({ min: 4 }),
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
      console.log(error);
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
      const { errors } = validationResult(req);
      if (errors.length > 0)
        return res.json({
          data: {
            user: null,
          },
          success: false,
          message: "validation failed",
        });

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
          message: "Invalid email or password",
        });
      }

      // verified user create JWT
      const token = signJWT({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      await user.save();
      return res.json({
        data: {
          token,
        },
        success: true,
        message: "User Logged in Successfully ",
      });
    } catch (error) {
      console.log(error);
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

/*
type : GET
path : /user/all
body : none
query: none
description: Route to get all user
*/

router.get("/all", isAdmin, isAuthenticated, async (req, res) => {
  // !TODO make sure that only the admin can access this route

  try {
    const users = await User.find({}).select(
      "firstName lastName email addresses orders"
    );

    return res.json({
      data: {
        users,
      },
      success: true,
      message: "Users Feched Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        users: [],
      },
      success: false,
      message: error.message,
    });
  }
});

/*
type : GET
path : /user/profile/me
body : none
query: none
header: authorization = bearer token
description: Route to get profile detailes
*/

router.get("/profile/me", isAuthenticated, async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    // console.log(token);

    // const { id } = jwt.verify(token, process.env.SECRET_JWT);
    const { id } = await verifyJWT(token);
    console.log(id);

    //get the user id from json token
    const user = await User.findOne({ _id: id });
    return res.json({
      data: {
        user,
      },
      success: true,
      message: "User profile fetched successfully",
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
});

export default router;
