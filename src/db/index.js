import mongoose from "mongoose";
import {app} from "../app.js"
import {DB_NAME} from "../constants.js"

async function connectDB(){
    
try {
        const connection= await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("some error occured",error)
        })
        console.log("mongoose server connected!")
        return connection
} catch (error) {
    console.log("some error occured connecting to the database",error.message)
}
}

export {connectDB}
