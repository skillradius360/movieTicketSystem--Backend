import mongoose, { isValidObjectId } from "mongoose"
import { theatres } from "../models/theatre.models"
import { user } from "../models/user.models"
import {asyncHandler} from "../utils/asyncHandler"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"

const findLocations= async function(country="India"){

        
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Specify content type
            },
            body: JSON.stringify({ country: country }) // Use JSON.stringify to format the body
        });
    
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error:", response.status, errorText);
            return;
        }
    
        const locationsFinalData = await response.json();
    return locationsFinalData
  
}

const addTheatre = asyncHandler(async(req,res)=>{
    const {title,location,hallType}= req.body

    if([title,location,hallType].some((data)=>data.trim==="")){
        throw new apiError(400,"hall details not recieved properly")
    }
    
    const isTheatre= await theatres.findById({
        $or:[title,location]
    })

    if(isTheatre){
            throw new apiError(400, "theatre already exists")
        }
        
        const newTheatre = await theatres.create({
            title:title,
            location:location,
            hallType:hallType
        })
        
    if(!newTheatre) {
        throw new apiError(400, "theatre creation failure")
    }

    const isEntryDone = await theatres.findById(isTheatre._id)
    if(!isEntryDone) throw new apiError(400,"theatre not created successfully")


    return res.status(200).json(apiResponse(400,{isEntryDone},"theatre data created successfully"))
})

const removeTheatre =  asyncHandler(async(req,res)=>{
    const {theatreId} = req.params

    if(!isValidObjectId(theatreId)){
        throw new apiError(400,"the theatreId is not  valid it seems")
    }

    const removedHall = theatres.findByIdAndDelete(theatreId)
    if(!removedHall) {
        throw new apiError(400,"hall removal failure!!")
    }

    return res.status(200).json(apiResponse(200,
        {hallName:removedHall.title,
            location:removedHall.location
        },
        "removed the theatre from map successfully!! "
    ))
})

const findByLocation = asyncHandler(async(req,res)=>{
    const {loc}= req.body
    
    if(!loc) {
        throw new apiError(400,"location not properly entered!!")
    }

    const allLocationsData= findLocations()
    if(!allLocationsData) {
        throw new apiError(400,"localtions not fetched successfuly")
    }

    const cityExists= allLocationsData.data?.some((e)=>e===loc)
    if(!cityExists){
        throw new apiError(400,"city invalid")
    }

    const allTheatreData= theatres.find({location:loc})
    if(!allTheatreData){throw new apiError("theatre data fetching PROBLEM occured according to location")}
})

return res.status(200).json(new apiResponse(200,allTheatreData,"theatre data fetch success"))

export {addTheatre,
    removeTheatre,
findByLocation,
}