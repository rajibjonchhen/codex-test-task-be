import express from "express";
import TaskModel from "./task-schema.js"
const tasksRouter = express.Router()

//**************** post user *********************/
tasksRouter.post("/:projectId", async(req, res, next) => {
    try {
        const newTask = new TaskModel({ ...req.body, project: req.params.projectId });
        const task = await newTask.save();
        if (task) {
        res.send({ task });
        }  else {
        console.log("bad request missing field could not create task");
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

//**************** get all users ******************/
tasksRouter.get("/", (req, res, next) => {

})

//**************** post user *********************/
tasksRouter.get("/:taskId", (req, res, next) => {

})

export default tasksRouter;