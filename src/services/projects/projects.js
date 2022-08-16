import express from "express";
import createError from "http-errors";
import multer from "multer";
import { JWTAuthMW } from "../authentication/JWTAuthMW.js";
import ProjectModel from "./project-schema.js";
import TaskModel from "../tasks/task-schema.js";
import { managerMW } from "../authentication/managerMW.js";

const projectsRouter = express.Router();

/***************************  register new project ***********************/
projectsRouter.post("/", JWTAuthMW, async (req, res, next) => {
  try {
    const newproject = new ProjectModel({
      ...req.body
    });
    const project = await newproject.save();
    if (project) {
      res.send({ project });
    } else {
      console.log("bad request missing field could not create project");
      next(
        createError(401, {
          message: "bad request missing field could not create project",
        })
      );
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/*****************************  get all projects *************************/
projectsRouter.get("/", JWTAuthMW, async (req, res, next) => {
  try {
    const search = req.query.s;
    const projects = await ProjectModel.find().populate({path:'developers', select:''});

    if (req.query.s) {
      const projects = await ProjectModel.find({
        $or: [
          { title: `/^${search}/i` },
          { description: `/^${search}/i` },
        ],
      }).populate({ path: "developers", select: "" });
      res.send({ projects });
    } else {
      res.send({ projects });
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/*****************************  get my projects *************************/
projectsRouter.get("/me", JWTAuthMW, async (req, res, next) => {
  try {
    const search = req.query.s;
    const projects = await ProjectModel.find({developers: req.user._id }).populate({ path: "developers", select: "" });

    if (req.query.s) {
      const projects = await ProjectModel.find({
        // $or: [{ title: `${search}` }],
        $or: [
          { title: `/^${search}/i` },
          { description: `/^${search}/i` },
        ],
      }).populate({ path: "developers", select: "" });
      res.send({ projects });
    } else {
      res.send({ projects });
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/***************************  edit project by id route ************************/
projectsRouter.put("/:projectId", JWTAuthMW, async (req, res, next) => {
  try {
    const project = await ProjectModel.findById(req.params.projectId);
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      { new: true }
    );
    res.send({ project: updatedProject });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/***************************  assign developer to a project ************************/
projectsRouter.put(
  "/:projectId/developers",
  JWTAuthMW,
  async (req, res, next) => {
    try {
      const project = await ProjectModel.findById(
        req.params.projectId
      )
      if (project.developers.includes(req.body.developer)) {
        const project = await ProjectModel.findById(
            req.params.projectId
          ).populate({ path: "developers", select: "" });
        res.send({ project, message: "developer already assigned to project" });
      } else {
        const updatedProject = await ProjectModel.findByIdAndUpdate(
          req.params.projectId,
          { $push:{developers: req.body.developer} },
          { new: true }
        ).populate({ path: "developers", select: "" });
        res.send({ project: updatedProject });
      }
    } catch (error) {
      console.log(error);
      next(createError(error));
    }
  }
);

/***************************  get project by id  ************************/
projectsRouter.get("/:projectId", JWTAuthMW, async (req, res, next) => {
  try {
    const project = await ProjectModel.findById(req.params.projectId)
      .populate({
        path: "developers",
        select: "name surname email",
      })
      .populate({
        path: "tasks",
        select: "",
      });
    res.send({ project });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/***************************  get tasks of a project ************************/
projectsRouter.get("/:projectId/tasks", async (req, res, next) => {
  try {
    const projects = await ProjectModel.findById(req.params.projectId).populate(
      { path: "tasks", select: " " }
    ).populate({ path: "developers", select: "" });
    const tasks = projects.tasks;
    res.send({ tasks });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/****************************  add tasks to project *************************/
projectsRouter.post("/:projectId/tasks", JWTAuthMW, async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const newTask = new TaskModel({
      ...req.body,
      project: projectId,
    });
    const { _id } = await newTask.save();
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $push: { tasks: _id } },
      { new: true }
    ).populate({ path: "tasks", select: "" });
    res.status(201).send({ project, newTaskId: _id });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/***************************  delete project byid route ************************/
projectsRouter.delete(
  "/:projectId",
  JWTAuthMW,
  managerMW,
  async (req, res, next) => {
    try {
      if (req.user.role === "admin") {
        const updatedProject = await ProjectModel.findByIdAndDelete(
          req.params.projectId
        );
        res.send({ project: updatedProject });
      }
    } catch (error) {
      console.log(error);

      next(createError(error));
    }
  }
);

/***************************  project routes ************************/


/***************************  register new project ***********************/
projectsRouter.post("/", JWTAuthMW, async (req, res, next) => {
  try {
    const newproject = new ProjectModel({
      ...req.body,
      creator: req.user._id,
    });
    const project = await newproject.save();
    if (project) {
      res.send({ project });
    } else {
      console.log("bad request missing field could not create project");

      next(
        createError(401, {
          message: "bad request missing field could not create project",
        })
      );
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/*****************************  get all projects *************************/
projectsRouter.get("/", async (req, res, next) => {
  try {
    const search = req.query.s;
    const projects = await ProjectModel.find();
    if (req.query.s) {
      const projects = await ProjectModel.find({
        $or: [{ title: `${search}` }],
      });

      res.send({ projects });
    } else {
      res.send({ projects });
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

export default projectsRouter;
