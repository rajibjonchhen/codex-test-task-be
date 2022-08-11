import express  from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import usersRouter from "./services/users/users.js";
import projectsRouter from "./services/projects/projects.js";
import tasksRouter from "./services/tasks/tasks.js";
import commentsRouter from "./services/comments/comments.js";
import { badRequestHandler, forbiddenHandler, genericErrorHandler, notFoundHandler, unauthorizedHandler } from "./services/errors/errorHandler.js";

const server = express()

const PORT = process.env.PORT || 3001

server.use(express.json())


//************************* Cors ***************************//
const whiteListOrigin = [process.env.PROD_URL, process.env.DEV_URL]

server.use(cors({
    origin: function(origin, next){
        if(!origin || whiteListOrigin.indexOf(origin)!== -1){
            next(null, true)
        }else{
            next(new Error("Not allowed by CORS"))
        }
    }
}))

//************************* Routes *****************************//
server.use("/users", usersRouter)
server.use("/projects", projectsRouter)
server.use("/tasks", tasksRouter)
server.use("/comments", commentsRouter)


/************************* Error Handler ***********************/
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(forbiddenHandler)
server.use(genericErrorHandler)

//********************* Connect to MongoDB ***********************//

mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected" , () => {
    console.log("Successfully connected to mongoDB")
})

//********************** listen to server ***********************//

server.listen(PORT, () => {
    console.table(listEndpoints(server))
    console.log("The server is running in port", PORT)
  })

//***************** check server connection *********************//

server.on("error", (error) => {
    console.log("server has stopped due to error")})