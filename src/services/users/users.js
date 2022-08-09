import express from "express"
import createError from "http-errors";
import UserModel from "./user-schema.js";


const usersRouter = express.Router()

//**************** post user *********************/
usersRouter.post("/", async(req, res, next) => {
    try {
        const newUser = new UserModel(req.body);
        const user = await newUser.save();
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

//**************** get all users ******************/
usersRouter.get("/", (req, res, next) => {

})

//**************** post user *********************/
usersRouter.get("/:userId", (req, res, next) => {

})

export default usersRouter;