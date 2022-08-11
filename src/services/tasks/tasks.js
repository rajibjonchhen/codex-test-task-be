import express from "express";
import { JWTAuthMW } from "../authentication/JWTAuthMW.js";
import TaskModel from "./task-schema.js"
import CommentModel from "../comments/comment-schema.js"
const tasksRouter = express.Router()

//**************** get a task by id *********************/
tasksRouter.get("/:taskId", JWTAuthMW, async(req, res, next) => {
    try {
        const task = await TaskModel.findById(req.params.taskId).populate({path:"comments", select:""})
        if (task) {
        res.send({ task });
    }  else {
        console.log("could not find task");
        res.send({error: "could not find task"});
        next(
            createError(401, {
            message: "bad request missing field could not create task",
            })
        );
        }
    } catch (error) {
        console.log(error);
        next(createError(error));
    }
})

//******************* edit a task  ************************/
tasksRouter.put("/:taskId", JWTAuthMW, async(req, res, next) => {
    try {
        const task = await TaskModel.findByIdAndUpdate(req.params.taskId, req.body, {new:true}).populated({path:"comments", select:""})
        if (task) {
        res.send({ task });
    }  else {
        console.log("could not find task");
        res.send({error: "could not update a task"});
        next(
            createError(401, {
            message: "bad request missing field could not create task",
            })
        );
        }
    } catch (error) {
        console.log(error);
        next(createError(error));
    }
})


/****************************  add comment to a task *************************/
tasksRouter.post("/:taskId/comments", JWTAuthMW, async (req, res, next) => {
    try {
      const taskId = req.params.taskId
      const newComment = new CommentModel({
        ...req.body,
        task: taskId,
      })
      const { _id } = await newComment.save()
      const updatedTask = await TaskModel.findByIdAndUpdate(
        taskId,
        { $push: { comments: _id } },
        { new: true }
      ).populate({ path: "comments", select: "" })
      res.status(201).send({ updatedTask: updatedTask })
    } catch (error) {
      console.log(error)
      next(createError(error))
    }
  })

export default tasksRouter;