import mongoose from "mongoose"


const { Schema, model } = mongoose;

const TaskSchema = new Schema({
    title: { type: String, required: true},
    status:{ type: String, required: true, enum:['waiting', 'implementation', 'verifying', 'releasing']},
    comments:[{type:Schema.Types.ObjectId, ref:'Comments'}],
    developer:{type:Schema.Types.ObjectId, ref:'Users'},
},{
    timestamps: true,
})

export default model("Tasks", TaskSchema)

