import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema= mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    fullName:{
        type:String,
        lowercase:true
    },
    email:{
        type:String,
        required:true
    },

    refreshToken:{
        type:String //refreshToken 
    },

    age:{
        type:Number
    },

    avatar:{
        type:String,
        required:true
    },

    location:{
        type:String
    },

    seatNo:{
        type:[mongoose.Types.ObjectId],
        ref:"seats"
    },

    hallNo:{
        type:mongoose.Types.ObjectId,
        ref:"hall"
    }
},{timestamps:true}
)

userSchema.pre("save",async function(next){
if(this.isModified("password")){
    return next()
}
this.password= await bcrypt.hash(this.password,8)
next()

})

userSchema.methods.matchPassword= function(password){

    if(!password){
        console.log("enter the password")
        return;
    }
    const  isRight= bcrypt.compare(password,this.password)
    return isRight

}

userSchema.methods.generateAccessToken= function(){

    return jwt.sign({
        _id:_id,
        email:email,
        username:username
    },process.env.ACCESS_TOKEN_SECRET,
{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}


userSchema.methods.generateRefreshToken= function(){

    return jwt.sign({
        _id:_id,
        email:email,
        username:username
    },process.env.REFRESH_TOKEN_SECRET,
{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

export const user= mongoose.model("user",userSchema)

