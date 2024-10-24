import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"


const app = express()

app.use(express.urlencoded({
    limit:"16kb",
    extended:true
}))
app.use(express.json({
    limit:"16kb",

}))
app.use(express.static("../public/"))

app.use(cookieParser())

app.use(cors({
    origin:"*"
}))

// ***********************************************************
import { userRouter } from "./routes/user.routes.js"
import {theatreRouter} from "./routes/theatre.routes.js"

app.use("/users",userRouter)
app.use("/theatre",theatreRouter)

export  {app}