import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/apierror.js";


const userSchema = new Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type: String,
            required:true,
            trim:true,
            index: true
        },
        avatar:{
            type:String,  //cloudinary url provide url
            required: true,
        },
        coverImage:{
            type:String, 
        },
        watchHistory:[      //array becoz multiple value will be there
            {
                type: Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,'Password is required']
        },
        refreshTOken:{

        }
    },{
        timestamps:true
    }
)

//for encryption of password just before saving data   pre=(hooks or middleware)
userSchema.pre("save", async function(next) { 
      //ecryption takes time isliye async use krege aur next ko call kr dege ki aage ki procedure kro
{    if(!this.isModified("password")) return next();
}    
try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    
} catch (error) {
    throw new ApiError(400, "Password is not hashed")
}})
//jo password user ne login krte samay dala usko jo bcrypt password se compare krege
userSchema.methods.isPasswordCorrect = async function(password){
try {
        return await bcrypt.compare(password, this.password)
    
} catch (error) {
    throw new ApiError(404,"issue in comparing")
    next(error);
}}





//jwt is basically used jab user login krta hai to usko kitne der tk data bhej sakte hai jaise yaha ek din tk server
// client / mobile user ko login ke baad ek token dega aur jab bhi server ko request jayegi to ye token ke sath 
//jayegi to server samz jayega ye valid user hai aur ek din naad ek token expire ho jayegi to user ko phirse login krna pdega

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema)
