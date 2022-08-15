import mongoose from "mongoose"


const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    comment: { type: String, required: true},
    commentedBy:{type:Schema.Types.ObjectId, ref:'Users'},
    task:{type:Schema.Types.ObjectId, ref:'Tasks'},
    
},{
    timestamps: true,
})

export default model("Comments", CommentSchema)
