import mongoose from "mongoose"
import bcrypt from "bcrypt"


const { Schema, model } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true},
    surname: { type: String, required: true},
    email: { type: String, required: true, unique:[true, "email must be unique"] },
    avatar: { type: String, default: "https://ui-avatars.com/api/?name=John+Doe" },
    role: { type: String, required: true,  enum:["manager","developer"]},
    password: { type: String },
    task:[{type:Schema.Types.ObjectId, ref:'Tasks'}],
    refreshToken :{ type : String},
    userVerification:{ type: String, enum:['waiting', 'verified'], default: 'waiting'},
},{
    timestamps: true,
})


UserSchema.pre("save", async function(next){
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

export default model("Users", UserSchema)

