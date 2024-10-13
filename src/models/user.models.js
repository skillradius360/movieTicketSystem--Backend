import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
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
    },
    otp:{
        type:String,
        default:"0"
    }
},{timestamps:true}
)

userSchema.pre("save",async function(next){
if(!this.isModified("password")){
    return next()
}
this.password=  await bcrypt.hash(this.password,8)
next()

})


userSchema.methods.matchPassword= async function(password){

    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken= function(){

    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username
    },process.env.ACCESS_TOKEN_SECRET,
{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}


userSchema.methods.generateRefreshToken= function(){

    return jwt.sign({
        _id:this._id,
    
    },process.env.REFRESH_TOKEN_SECRET,
{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

mongoose.plugin(mongooseAggregatePaginate)

export const user= mongoose.model("user",userSchema)

