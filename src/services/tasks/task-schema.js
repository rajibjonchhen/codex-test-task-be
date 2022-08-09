import mongoose from "mongoose"


const { Schema, model } = mongoose;

const TaskSchema = new Schema({
    title: { type: String, required: true},
},{
    timestamps: true,
})

export default model("Tasks", TaskSchema)

