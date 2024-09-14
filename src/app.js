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

export  {app}