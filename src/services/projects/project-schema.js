import mongoose from "mongoose"


const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: { type: String, required: true},
    description:{type: String},
    developers:[{type:Schema.Types.ObjectId, ref:'Users'}],
    tasks:[{type:Schema.Types.ObjectId, ref:'Tasks'}],
},{
    timestamps: true,
})

export default model("Projects", ProjectSchema)

