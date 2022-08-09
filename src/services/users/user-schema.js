import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true, unique:[true, "username must be unique" ]},
    surname: { type: String, required: true, unique:[true, "username must be unique" ]},
    email: { type: String, required: true, unique:[true, "email must be unique"] },
    avatar: { type: String, required: true, default: "https://ui-avatars.com/api/?name=John+Doe" },
    role: { type: String, required: true,  enum:["manager","developer"]},
    password: { type: String },
    refreshToken :{ type : String}
},{
    timestamps: true,
})

export default model("Users", userSchema)

