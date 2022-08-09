import express from "express";
import createError from "http-errors";
import multer from "multer";
import { JWTAuthMW } from "../authentication/JWTAuthMW.js";
import ProjectModel from "./project-schema.js";
import UserModel from "../users/user-schema.js";
import { roleMW } from "../authentication/roleMW.js";


const projectsRouter = express.Router();

/***************************  manager only routes ************************/

/***************************  edit project by id route ************************/
projectsRouter.put(
  "/:projectId",
  JWTAuthMW,
  async (req, res, next) => {
    try {
      if (req.user.role === "admin") {
        const updatedProject = await ProjectModel.findByIdAndUpdate(
          req.params.projectId,
          req.body,
          { new: true }
        );
        res.send({ project: updatedProject });
      }
    } catch (error) {
      console.log(error);

      next(createError(error));
    }
  }
);

/***************************  delete project byid route ************************/
projectsRouter.delete(
  "/:projectId",
  JWTAuthMW,
  roleMW,
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

/*****************************  get all my projects *************************/
projectsRouter.get("/me", JWTAuthMW, async (req, res, next) => {
  try {
    const projects = await ProjectModel.find({
      creator: req.user._id,
    }).populate({ path: "creator", select: "name surname email avatar " });

    projects.forEach((project, i) => {
      const isLiked = project.Likes.find(
        (like) => like.toString() === req.user._id
      );
      if (isLiked) {
        projects[i].isLiked = true;
      } else {
        projects[i].isLiked = false;
      }
    });
    res.send({ projects });
  } catch (error) {
    console.log(error);

    next(createError(error));
  }
});

/*****************************  get all projects *************************/
projectsRouter.get("/projects", JWTAuthMW, async (req, res, next) => {
  try {
    const search = req.query.s;
    const projects = await ProjectModel.find();

    if (req.query.s) {
      const projects = await ProjectModel.find({
        // $or: [{ title: `${search}` }],
        $or: [{"title": `/^${search}/i`},{"name": `/^${search}/i`}, {"description": `/^${search}/i`}, {"summary": `/^${search}/i`}]
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

/***************************  get project byid route ************************/
projectsRouter.get("/:projectId", async (req, res, next) => {
  try {
    const project = await ProjectModel.findById(req.params.projectId).populate({
      path: "creator",
      select: "name surname email avatar bio interest ",
    });

    if (req?.user?._id) {
      const isLiked = project.Likes.find(
        (like) => like.toString() === req.user._id
      );
      if (isLiked) {
        project.isLiked = true;
        res.send({ project });
      } else {
        project.isLiked = false;
        res.send({ project });
      }
    } else {
      res.send({ project });
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

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

/****************************  edit my project *************************/
projectsRouter.put("/me/:projectId", JWTAuthMW, async (req, res, next) => {
  try {
    const project = await ProjectModel.findById(req.params.projectId);
    if (project) {
      if (project.creator.toString() === req.user._id) {
        const updatedProject = await ProjectModel.findByIdAndUpdate(
          req.params.projectId,
          req.body,
          {
            new: true,
          }
        ).populate({
          path: "creator",
          select: "name surname email avatar bio interest ",
        });
        res.send({ updatedProject });
      } else {
        console.log(" not authorised to update the project");

        next(
          createError(401, {
            message: " not authorised to update the project",
          })
        );
      }
    } else {
      next(createError(404, { message: "could not find the project" }));
    }
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

/***************************  delete my project ************************/
projectsRouter.delete("/me/:projectId", JWTAuthMW, async (req, res, next) => {
    try {
      const project = await ProjectModel.findById(req.params.projectId);
      if (project) {
        if (project.creator.toString() === req.user._id) {
          const updatedProject = await ProjectModel.findByIdAndDelete(
            req.params.projectId
          );
          res.send();
        } else {
          console.log("could not find the project");

          next(
            createError(401, {
              message: " not authorised to delete the project",
            })
          );
        }
      } else {
        console.log("could not find the project");

        next(createError(404, { message: "could not find the project" }));
      }
    } catch (error) {
      console.log(error);
      next(createError(error));
    }
  })


  /*****************************  like project *************************/
  projectsRouter.put("/:projectId/likes", JWTAuthMW, async (req, res, next) => {
    try {
      const reqProject = await ProjectModel.findById(req.params.projectId);
      if (reqProject) {
        const isLiked = reqProject.Likes.find(
          (like) => like.toString() === req.user._id
        );
        const counts = reqProject.Likes.length;

        if (!isLiked) {
          const updatedProject = await ProjectModel.findByIdAndUpdate(
            req.params.projectId,
            { $push: { Likes: req.user._id }, LikesCounts: counts + 1 },
            { new: true }
          );

          const user = await UserModel.findByIdAndUpdate(req.user._id, {
            $push: { projectsLiked: req.params.projectId },
          });

          updatedProject.isLiked = true;
          res.send({ project: updatedProject, user: user });
        } else {
          const updatedProject = await ProjectModel.findByIdAndUpdate(
            req.params.projectId,
            { $pull: { Likes: req.user._id }, LikesCounts: counts - 1 },
            { new: true }
          );
          const user = await UserModel.findByIdAndUpdate(req.user._id, {
            $pull: { projectsLiked: req.params.projectId },
          });
          updatedProject.isLiked = false;
          res.send({ project: updatedProject, user: user });
        }
      } else {
        console.log("bad request could not find the required project");
        next(
          createError(404, {
            message: "bad request could not find the required project",
          })
        );
      }
    } catch (error) {
      console.log(error);
      next(createError(error));
    }
  });

export default projectsRouter;
