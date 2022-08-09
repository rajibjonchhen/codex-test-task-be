import express  from "express";
import cors from "cors";
import mongoose from "mongoose";

const server = express()

const PORT = process.env.PORT || 3000

server.use(express.json())

const whiteListOrigin = [process.env.PROD_URL, process.env.DEV_UR]

server.use(cors({
    origin: function(origin, next){
        if(!origin || whiteListOrigin.indexOf(origin)!== -1){
            next(null, true)
        }else{
            next(new Error("Not allowed by CORS"))
        }
    }
}))


mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected" , () => {
    console.log("Successfully connected to mongoDB")
})

server.on("error", (error) => {
    console.log("server has stopped due to error")})