import { apiError } from "../utils/apiError.js";
import { user } from "../models/user.models.js";
import jwt from "jsonwebtoken"

export const verifyJWT= async function (req,res,next){
    const accessToken = req.cookies?.AccessToken
    if(!accessToken){
        throw new apiError(401,"No cookies found! Please login back")
    }
    const tokenState= jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET )
    if(!tokenState) throw new apiError(400,"Invalid cookie token")

    const isUserFound = user.findById(tokenState._id)
    if(!isUserFound) throw new apiError(404, "no user Found ")
    
    req.User= isUserFound
    next()
}

