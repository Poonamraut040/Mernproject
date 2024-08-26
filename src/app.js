import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()


//use to ensure that only valis client is requesting to server but in this we are allowing any client request
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit:"16kb"})) 
app.use(express.urlencoded({extended:true,limit:"16kb"}))    //url change ho jate hai usme % + sign vgere aa jate isliye ki humara app aise request bhi le sake 
app.use(express.static("public")) //file images vgere publically
app.use(cookieParser()) //store the data or imformation required for basic operation

export { app }