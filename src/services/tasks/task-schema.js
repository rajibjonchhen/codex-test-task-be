import mongoose from "mongoose"


const { Schema, model } = mongoose;

const TaskSchema = new Schema({
    task: { type: String, required: true},
    description:{type: String},
    status:{ type: String, required: true, enum:['waiting', 'implementation', 'verifying', 'releasing'], default:"waiting"},
    project:{type:String, required:true},
    comments:[{type:Schema.Types.ObjectId, ref:'Comments'}],
    developers:[{type:Schema.Types.ObjectId, ref:'Users'}],
},{
    timestamps: true,
})

export default model("Tasks", TaskSchema)

