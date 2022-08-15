import express from "express";
import { JWTAuthMW } from "../authentication/JWTAuthMW.js";
import TaskModel from "./task-schema.js";
import CommentModel from "../comments/comment-schema.js";
const tasksRouter = express.Router();

//**************** get a task by id *********************/
tasksRouter.get("/:taskId", JWTAuthMW, async (req, res, next) => {
  try {
    const task = await TaskModel.findById(req.params.taskId)
      .populate({ path: "comments", select: "" })
      .populate({ path: "developers", select: "" });
    if (task) {
      res.send({ task });
    } else {
      console.log("could not find task");
      res.send({ error: "could not find task" });
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
});

//******************* edit a task  ************************/
tasksRouter.put("/:taskId", JWTAuthMW, async (req, res, next) => {
  try {
    const task = await TaskModel.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    ).populate({ path: "comments", select: "" });
    if (task) {
      res.send({ task });
    } else {
      console.log("could not find task");
      res.send({ error: "could not update a task" });
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
});

//******************* assign developer to a task  ************************/
tasksRouter.put("/:taskId/developers", JWTAuthMW, async (req, res, next) => {
  try {

    const task = await TaskModel.findById(req.params.taskId).populate({path:"developers", select:""})

    if(task.developers.includes(req.body.developer)){
        res.send({ task, message: "developer already assigned to task" })
    } else{

       const updatedTask = await TaskModel.findByIdAndUpdate(
            req.params.taskId,
            { developers: task.developers.concat(req.body.developer) },
            { new: true }
            ).populate({ path: "comments", select: "" }).populate({ path: "developers", select: "" });
        res.send({ task:updatedTask})

        }
    
    } catch (error) {
        console.log(error);
        next(createError(error));
    }

});

/****************************  add comment to a task *************************/
tasksRouter.post("/:taskId/comments", JWTAuthMW, async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const newComment = new CommentModel({
      ...req.body,
      commentedBy: req.user._id,
      task: taskId,
    });
    const { _id } = await newComment.save();
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { $push: { comments: _id } },
      { new: true }
    )
      .populate({ path: "comments", select: "" })
      .populate({
        path: "comments",
        populate: { path: "commentedBy", select: "username" },
      });
    const comments = updatedTask.comments;
    res.status(201).send({ comments });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/****************************  get all comments of a task *************************/
tasksRouter.get("/:taskId/comments", JWTAuthMW, async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const tasks = await TaskModel.findById(taskId)
      .populate({ path: "comments", select: "" })
      .populate({
        path: "comments",
        populate: { path: "commentedBy", select: "" },
      });
    const comments = tasks.comments;
    res.status(201).send({ comments });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

export default tasksRouter;
