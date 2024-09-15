import mongoose from "mongoose";
import { user } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {cloudUploader} from "../utils/cloudinary.js"

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

const login = asyncHandler((req,res)=>{
    const {username,password}= req.body
    if((!username && password)){
        
    }
})

const logout = asyncHandler((req,res)=>{
    return res.status(200)
})

const refreshAccess= asyncHandler((req,res)=>{

})

const updateProfiledata= asyncHandler()

const updateprofilePicture= asyncHandler()

export {signUp,
    login,
    logout,
    refreshAccess,
    updateProfiledata,
    updateprofilePicture
}