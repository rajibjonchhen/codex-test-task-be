import express from "express"
import createError from "http-errors";
import UserModel from "./user-schema.js";
import {sendConfirmationEmail} from "../authentication/nodemailer.js";
import { authenticateUser } from "../authentication/tools.js";
import { JWTAuthMW } from "../authentication/JWTAuthMW.js";
import { managerMW } from "../authentication/managerMW.js";

const usersRouter = express.Router()

//**************** post user *********************/
usersRouter.post("/register", async(req, res, next) => {
    try {
        const newUser = new UserModel(req.body);
        const user = await newUser.save();
        // await sendConfirmationEmail({toUser: newUser.data, hash:newUser.data._id})
        // res.send({message:"You have been registered successfully. Please check your email to confirm your account"})
        if (user) {
          const token = await authenticateUser(user);
          res.send({user, token});
        } else {
        console.log(error)
    
          next(
            createError(401, {
              message: "bad request missing field could not create user",
            })
          );
        }
      } catch (error) {
        console.log(error)
        next(createError(error));
      }
})

//**************** sign in users ******************/
usersRouter.post("/signin", async(req, res, next) => {
    try {
    const { email, password } = req.body;
    const reqUser = await UserModel.checkCredentials(email, password);
    if (reqUser) {
      const user = await UserModel.findById(reqUser._id);
      const token = await authenticateUser(user);
      res.send({ user, token });
    } else {
      next(createError(401, { message: "User not found invalid email or password" }));
    }
    } catch (error) {
        console.log(error)
        next(createError(error));
    }

})

//**************** get all users ******************/
usersRouter.get("/", async(req, res, next) => {
    try {
        const users = await UserModel.find()
        res.send({users})
    } catch (error) {
        console.log(error)
        next(createError(error));
    }
})
//**************** edit a users ******************/
usersRouter.put("/:userId",JWTAuthMW,  async(req, res, next) => {
    try {
        const userId = req.params.userId;
        const users = await UserModel.findByIdAndUpdate(userId, req.body, {new:true})
        res.send({users})
    } catch (error) {
        console.log(error)
        next(createError(error));
    }
})

//**************** get my info ******************/
usersRouter.get("/me", JWTAuthMW, async(req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id)
        res.send({user})
    } catch (error) {
        console.log(error)
        next(createError(error));
    }
})

//**************** get developers *******************/
usersRouter.get("/developers", async(req, res, next) => {
    try {
        const developers = await UserModel.find({role:"developer"})
        res.send({developers})
    } catch (error) {
        console.log(error)
        next(createError(error));
    }
})

export default usersRouter;