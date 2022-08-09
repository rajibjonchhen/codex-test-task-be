import mongoose from "mongoose"


const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: { type: String, required: true},
},{
    timestamps: true,
})

export default model("Projects", ProjectSchema)

