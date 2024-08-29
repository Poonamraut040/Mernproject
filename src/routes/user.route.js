import { Router } from "express";
import { logoutUser,loginUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifiyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([     //multer middleware for file handling
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser)  //registeruser is method calls when //http://localhost:8000/users/register route is used and this method is written in controllers


router.route("/login").post(loginUser)

//secured route
router.route("/logout").post(verifiyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)



export default router