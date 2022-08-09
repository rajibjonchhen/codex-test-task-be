import express from "express"
import createError from "http-errors";
import UserModel from "./user-schema.js";
import {sendConfirmationEmail} from "../authentication/nodemailer.js";
import { authenticateUser } from "../authentication/tools.js";

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
usersRouter.post("/signin", (req, res, next) => {
    try {
        res.send({message:"You have been signed in successfully"})
    } catch (error) {
        
    }

})

//**************** get all users ******************/
usersRouter.get("/", (req, res, next) => {
    try {
        res.send({message:"get all users"})
    } catch (error) {
        
    }
})

//**************** get user by id *******************/
usersRouter.get("/:userId", (req, res, next) => {
    try {
        res.send({message:"get user by id"})
    } catch (error) {
        
    }
})

export default usersRouter;