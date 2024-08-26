import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser)  //registeruser is method calls when //http://localhost:8000/users/register route is used and this method is written in controllers


export default router