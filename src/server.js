import express  from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import usersRouter from "./services/users/users.js";

const server = express()

const PORT = process.env.PORT || 3000

server.use(express.json())

const whiteListOrigin = [process.env.PROD_URL, process.env.DEV_URL]

// CORS
server.use(cors({
    origin: function(origin, next){
        if(!origin || whiteListOrigin.indexOf(origin)!== -1){
            next(null, true)
        }else{
            next(new Error("Not allowed by CORS"))
        }
    }
}))


server.use("/users", usersRouter)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected" , () => {
    console.log("Successfully connected to mongoDB")
})

// listen to server
server.listen(PORT, () => {
    console.table(listEndpoints(server))
    console.log("The server is running in port", PORT)
  })

//  check server connection
server.on("error", (error) => {
    console.log("server has stopped due to error")})