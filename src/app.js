import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()


//use to ensure that only valis client is requesting to server but in this we are allowing any client request
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//middlewares
app.use(express.json({limit:"16kb"})) 
app.use(express.urlencoded({extended:true,limit:"16kb"}))    //url change ho jate hai usme % + sign vgere aa jate isliye ki humara app aise request bhi le sake 
app.use(express.static("public")) //file images vgere publically
app.use(cookieParser()) //store the data or imformation required for basic operation

//route imports

import userRouter from './routes/user.route.js'


//routes declaration (we use app.get('/)) when we used to write router and contoller in this file
// but we ahave separate folder and files for router and controller that is why new syntax

app.use("/api/v1/users", userRouter) //jab bhi /users pe jayege to controll jayega userRoute ke pass jo humne bnaya hai
//http://localhost:8000/users/register  agr login chahiye to bhi koi changes nahi vo sidha userrouter ko command de raha ab vaha jo likha hai vo chlega
//http://localhost:8000/api/v1/users/login

export { app }