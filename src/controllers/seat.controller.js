import mongoose, { isValidObjectId } from "mongoose"
import { theatres } from "../models/theatre.models.js"
import { user } from "../models/user.models.js"
import asyncHandler from "../utils/asyncHandler.js"
import { seats } from "../models/seat.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"

const generateSeats= asyncHandler(async(req,res)=>{
    const {theatreName,hallName}= req.body

    if(!(theatreName,hallName)) throw new apiError(400, 'hall and theatre title name not entered')
    const maxSeats= 60
    const recliners=10
    const normalSeats= maxSeats-recliners

try {
    for (let i=0;i<maxSeats;i++){
        const totalStatus= await seats.create({
            uniqueTheatreId:String(hallName+theatreName+i) || String(i) || " ",
            reclinerOrNot: i==49?true:false
        })
    
    }
} catch (error) {
    console.log("some error occured while genearating seats")
    throw new Error(error)
}

if(!totalStatus) {
    throw new apiError(401,"seats generation failure")
}


res.status(200).json(new apiResponse(200,totalStatus,"seats generated successfully"))
})


export {
    generateSeats
}