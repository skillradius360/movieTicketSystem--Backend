import mongoose from "mongoose"
import Router from "express"
import { addTheatre,
    removeTheatre,
findByLocation, } from "../controllers/theatre.controller.js"

const theatreRouter = Router()

theatreRouter.route("/checkLocation").post(findByLocation)
theatreRouter.route("/addTheatre").post(addTheatre)
theatreRouter.route("/removeTheatre").post(removeTheatre)


export {theatreRouter}