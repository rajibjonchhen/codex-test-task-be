import mongoose from "mongoose"


const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: { type: String, required: true},
    developer:[{type:Schema.Types.ObjectId, ref:'Users'}],
},{
    timestamps: true,
})

export default model("Projects", ProjectSchema)

