import {connectDB} from "./db/index.js"
import {app} from "./app.js"
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})

connectDB().then(()=>{

    try {
        app.listen(process.env.PORT || 8080,()=>{
            app.on("error",(err)=>{
                console.log("some error occured with express!",err.message)
            })
            console.log("express connected!")
        })
    } catch (error) {
        console.log("some error occured while connecting to express",error)
    }
})
