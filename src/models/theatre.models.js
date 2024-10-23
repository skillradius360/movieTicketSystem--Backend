import mongoose from "mongoose"

const theatreSchema = new mongoose.Schema({

    title:{
        type:String,
        unique:true,
        required:true
    },
    hallCount:{
        type:[mongoose.Types.ObjectId],
        ref:"halls",
    },
    stars:{
        type:Number,
        max:5,
        min:0
    },
    location:{
        type:String,
        required:true
    },
    hallType:{
        type:String,
        required:true
    },
    hallIds:{
        type:[mongoose.Types.ObjectId],
        ref:"halls"
    }

},{timestamps:true}
)
export const theatres = mongoose.model("theatres",theatreSchema)