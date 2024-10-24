import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const seatSchema = new mongoose.Schema({

    seatHallsIds:{
        type:mongoose.Types.ObjectId,
        ref:"halls"
    },
    theatreId:{
        type : mongoose.Types.ObjectId,
        ref:"theatres",
        required:true
    },
    reclinerOrNot:{
        type:Boolean,
        requried:true,
        default:false
    },
    uniqueTheatreId:{
        type:String,
        
    }
},{timestamps:true})


seatSchema.plugin(mongooseAggregatePaginate)
export const seats = mongoose.Model("seats",seatSchema)