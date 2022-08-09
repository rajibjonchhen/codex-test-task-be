import mongoose from "mongoose"
import bcrypt from "bcrypt"


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


userSchema.pre("save", async function(next){
    const newUser = this
    const plainPw = newUser.password
    if(newUser.isModified("password")){
        const hash = await bcrypt.hash(plainPw,11)
    }
    next()
})


UserSchema.methods.toJSON = function() {
    const userDocument = this
    const userObject = userDocument.toObject()
    delete userObject.password
    return userObject
}

UserSchema.statics.checkCredentials = async function(email, plainPW){
    const user = await this.findOne({email})
    if(user){
        const isMatch = bcrypt.compare(plainPW, user.password)
        return isMatch? user: null
         
    } else
        return null
}

export default model("Users", userSchema)

