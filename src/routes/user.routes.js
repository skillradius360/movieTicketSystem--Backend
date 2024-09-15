import Router from "express"
import {upload} from "../middlewares/multer.middleware.js"

import {signUp,
login,
logout,
refreshAccess,
updateProfiledata,
updateprofilePicture
} from "../controllers/user.controllers.js"


const userRouter= Router()

userRouter.route("/signUp").post(upload.single("avatar"),signUp)

export {userRouter}
