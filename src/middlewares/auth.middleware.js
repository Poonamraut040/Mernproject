//will verify user or not
import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/apierror.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifiyJWT = asyncHandler(async (req, res, next) => {
            
        
try {                        //Authorization = Bearer <token>
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")   //check if the client requesting have cookies or not
        
        //const token = userUid.split("Bearer ")[1]; token = "Bearer 2687980934334$%^&*9876" therefore token = 2687980934334$%^&*9876
        if(!token){                            // jo string hai usko bearer  se split kiya to jo next word hai vo 1st index pe jayega
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).
        select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "invalid Access Token")
        }
    
        req.user = user;
        next()
    
} catch (error) {
    throw new ApiError(401, error?.message || "invalid access token")
} 
}) 
