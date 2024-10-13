import Router from "express"
import {upload} from "../middlewares/multer.middleware.js"
// import verifyJWT from "../middlewares/auth.middleware.js"

import {signUp,
    login,
    logout,
    refreshAccess,
    updateProfileData,
    updateProfilePicture,
    resetCredentials,
 validateOTP,
 saveOTP
} from "../controllers/user.controllers.js"


const userRouter= Router()

userRouter.route("/signUp").post(upload.single("avatar"),signUp)
userRouter.route("/login").post(login)
userRouter.route("/saveOTP").post(saveOTP)
userRouter.route("/resetCreds/:userId").post(resetCredentials)
userRouter.route("/validateOtp/:userId").post(validateOTP)
export {userRouter}
