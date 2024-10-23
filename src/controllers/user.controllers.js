import mongoose, { isValidObjectId } from "mongoose";
import { user } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {cloudUploader} from "../utils/cloudinary.js"
import sendMessage from "../utils/sendMail.js";

const signUp= asyncHandler(async(req,res)=>{
    const {username,password,fullName,email}= req.body

    if([username,password,fullName,email].some((data)=>data?.trim()==="")){
        throw new apiError(400,"username,password,fullName,email not captured")
    }

    const isUserPresent= await user.findOne({
        $or:[{username},{email}]
    })
    if(isUserPresent){
        throw new apiError(400,"The username or email exists.Please login!")
    }

    const avatarPath= req.file?.path

    console.log(req.file)
    if(!avatarPath){
        throw new apiError(400,"avatar img not found")
    }

    const avatarUploadLink= await cloudUploader(avatarPath)
    console.log(avatarUploadLink)
    if(!avatarUploadLink){
        throw new apiError(400,"avatar upload failed")
    }

    const userEntry= await user.create({
        username:username,
        password:password,
        fullName:fullName,
        email:email,
        avatar:avatarUploadLink?.url 
    })

    if(!userEntry){
        throw new apiError(400,"signup failure")
    }

    return res.status(200).json(new apiResponse(200,[userEntry],"signUp successful !"))

})


const generateAccessAndRefreshToken= async function(userId){
    try {
        if(!isValidObjectId(userId)){
            throw new apiError(400,"not a valid Id to parse for generating tokens")
        }
        const User= await user.findById(userId);
        if(!User){
            throw new apiError(400,"user not found to generate token")
        }
        const refreshToken=  User.generateRefreshToken()
        const accessToken=  User.generateAccessToken()
        
        User.refreshToken= refreshToken
        await User.save({validateBeforeSave:false})
    
        return { refreshToken,accessToken}
    
    } catch (error) {
        throw new apiError(400,{},"some error occured while generating tokens")
    }
}
// get idpass--> check if idpass is ok--->findAccount--->checkpass--->sendreswithbiscuits

const login = asyncHandler(async (req,res)=>{
    const {username,password,email}= req.body

    if(!(username && password)){
        throw new apiError(400,"username or opassword invalid!")
    }

    const userExists=await user.findOne({
        $and:[{username},{email}]
    })
    if(!userExists){
        throw new apiError(400,"user does not exist")
    }

    const userData= await user.findById(userExists._id)
    
    if(!userData){
        throw new apiError(400,"user not found in logging in")
    }

   const isMatch= await userData.matchPassword(password)
   if(!isMatch){
       throw new apiError(400,"password invalid")
   }
    const { refreshToken,accessToken}= await generateAccessAndRefreshToken(userData._id)

    const cookieOptions={
        httpOnly:true,secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,cookieOptions)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(new apiResponse(200,userData,"logged in successfully"))

})

const logout = asyncHandler(async(req,res)=>{
    const User= req.User._id
    if(!User) {
        throw new apiError(400," user not logged In")
    }

  const isUserExists= await user.findByIdAndUpdate(User,{
    $unset:{
        accessToken:1
    }
  },{new:true})

  const Options = {httpOnly:true,
    secure:true
  }
  if(!isUserExists) {
    throw new apiError(400,"user does not exist")
}

return res.status(200)
.clearCookie("accessToken",Options)
.clearCookie("refreshToken",Options)
.json(new apiResponse(200,{},"user successfully logged out "
))

})

const refreshAccess= asyncHandler(async (req,res)=>{
    const refreshTokenData= req.body.refreshToken || req.params.refreshToken

    if(!refreshTokenData){
        throw new apiError(400, "no refresh Token found by the user")
    }

    const isValidToken = await jwt.verify(refreshTokenData,process.env.REFRESH_TOKEN_SECRET)
    if(!isValidToken){
        throw new apiError(400, "Token Invalid")
    }

    const userExists = user.findById(isValidToken._id).select("-password")
    if(!userExists){
        throw new apiError(400, "cant find user through token ")
    }

   if(!userExists.refreshToken==refreshTokenData){
    throw new apiError(400, "refresh token does not match with user to refresh")
   }

   const {refreshToken,accessToken}= generateAccessAndRefreshToken(userExists._id)

   const Options = {
    httpOnly:true,
    secure:true
   }

   res.status(200)
   .cookie("accessToken",refreshToken,Options)
   .cookie("refreshToken",accessToken,Options)
   .json(new apiResponse(200,{userExists},"access and refreshToken refreshed successfully"))

})

const updateProfileData= asyncHandler(async(req,res)=>{

    const {fullName,username,age} = req.body
    if( [fullName,username,age].some((data)=>data.trim==="") ){
        throw new apiError(200,"some data missing from profile")
    }

    const userExists= user.findByIdAndUpdate(req.User._id,{
        $set:{
            fullName,
            username,
            age
        }
    },{new:true}
).select("-password -accessToken -refreshToken")
    if(!userExists){
        throw new apiError(400,"user not logged In!")
    }

    res.status(200).json(new apiResponse(200,{userExists}," profile updated successfully "))
})


const updateProfilePicture= asyncHandler(async(req,res)=>{

    const userLogged = req.User._id
    if(!userLogged){
        throw new apiError(400,"please login first to update profile")
    }

    const avatarEdit = req.file?.avatar?.path
    if(!avatarEdit){
        throw new apiError(400, "avatar not uploaded by user")
    }

    const uploadAvatarToCloud = await cloudUploader(avatarEdit)
    if(uploadAvatarToCloud){
        throw new apiError(400,"uploaded to cloud failed!")
    }

    const findUser= await user.findByIdAndUpdate(userLogged,{
        $set:{
            avatar:uploadAvatarToCloud?.url || ""
        }
    },{
        new:true
    }).select("-password -refreshToken" )

    if(!findUser){
        throw new apiError(400,"user updation failed")
    }

    res.status(200).json(new apiResponse(200,findUser,"user profile picture update success"))
})


//  **************************************2 F A *************************************
const generateOTP = async function(){
    let OTP= ""
    for(let i=0;i<6;i++){
        OTP+=Math.floor(Math.random()*10)
    }
    return OTP
}

const saveOTP = asyncHandler(async(req,res)=>{
    const {email}=  req.body

    if(!email){
     throw new apiError(400,"no email provided!")
    }

     const userExists= await user.findOne({email})
     if(!userExists) throw new apiError(400," User not found. Please SignUp")

        const currentOTP =  await generateOTP()

        userExists.otp= currentOTP
        await userExists.save({validateBeforeSave:false})

        const messageRes= await sendMessage("syncmaster420l@gmail.com",
            "lipikachowdhury56@gmail.com",
            "oohr syfi xati qjrk",
            "hello heres ur OTP",
            currentOTP,
            `<h2>${currentOTP}</h2>`
)   

if(!messageRes){
    throw new apiError(400,"message sending failure")
}
        return res.status(200).json(new apiResponse(200,{userid:userExists._id,currentOTP},"Message sent with id"+ messageRes,"Otp generated successfully"))
    })




const validateOTP = asyncHandler(async ( req, res)=>{
    const {userOtp }= req.body
    const {userId} = req.params
    if(!userOtp ){
        throw new apiError(400, "no otp recieved")
    }

    if(!isValidObjectId(userId)){
        throw new apiError("userid invalid")
    }

    const isUserLogged = await user.findById(userId)
    if(!isUserLogged){
        throw new apiError(400,"Please LogIn!")
    }

    if( !(isUserLogged.otp === userOtp) ){
        throw new apiError(400,"OTP not matched")
    }

    isUserLogged.otp =null
    await isUserLogged.save({validateBeforeSave:false})


    return res.status(200).json(new apiResponse(200,{},"The OTP has been reset successfully! "))

    })


const resetCredentials= asyncHandler(async(req,res)=>{
    const {newPassword }= req.body
    const {userId} = req.params


    if([userId, newPassword].some((data)=>data?.trim==="")){
        throw new apiError(400,"please provide old or new passwords")
    }

    if(!isValidObjectId(userId))throw new apiError(400,"userId passed not valid")

    const matchedUser = await user.findById(userId)
    if(!matchedUser) throw new apiError(400, "no user found after otp validation")


    matchedUser.password= newPassword
    await matchedUser.save()


    // if(matchedUser.password === newPassword){
    //     throw new apiError(400,"Failure updating password or pasword not encypted ")
    // }

    return res.status(200).json(new apiResponse(200,{Newpassword:matchedUser.password},"passwords reset success"))

})
//  *****************************************************2 F A ends here ************
export {signUp,
    login,
    logout,
    refreshAccess,
    updateProfileData,
    updateProfilePicture,
    
// *****2fa************
    resetCredentials,
 validateOTP,
 saveOTP
// ********************


}