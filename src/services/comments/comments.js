import express from "express";
import CommentModel from "./comment-schema.js";
import { JWTAuthMW } from "../authentication/JWTAuthMW.js";
import TaskModel from "../tasks/task-schema.js";
const commentsRouter = express.Router();

//************* get a comment by id ***************/
commentsRouter.get("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const comment = await CommentModel.findById(commentId);
    if (comment) {
      res.send({ comment });
    } else {
      console.log("could not find comment");
      res.send({ error: "could not find comment" });
      next(
        createError(401, {
          message: "bad request could not find comment",
        })
      );
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

//************* edit a comment ***************/
commentsRouter.put("/:commentId", async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const comment = await CommentModel.findByIdAndUpdate(commentId, req.body, {new:true});
      if (comment) {
        res.send({ comment });
      } else {
        console.log("could not find comment");
        res.send({ error: "could not find comment" });
        next(
          createError(401, {
            message: "bad request could not find comment",
          })
        );
      }
    } catch (error) {
      console.log(error);
      next(createError(error));
    }
  });

//**************** delete a comment *********************/
commentsRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    await CommentModel.findByIdAndDelete(commentId);
    const reqComment = await CommentModel.findById(commentId);
    if (reqComment) {
      const updatedTask = await TaskModel.findByIdAndUpdate(
        reqComment.task,
        { $pull: { comments: commentId} },
        { new: true }
      );
      res.send({ message: "comment deleted .." });
    } else {
      console.log("could not find comment");
      res.send({ error: "could not find comment" });
      next(
        createError(401, {
          message: "bad request could not find comment",
        })
      );
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

export default commentsRouter;
