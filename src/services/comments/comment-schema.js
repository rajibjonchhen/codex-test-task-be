import mongoose from "mongoose"


const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    title: { type: String, required: true},
},{
    timestamps: true,
})

export default model("Comments", CommentSchema)

C