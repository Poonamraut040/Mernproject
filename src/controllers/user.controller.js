import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";


const generateAccessAndRefreshTokens =  async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        // console.log("accesstoken is:", accessToken)
        // console.log("refreshtoken is",refreshToken)
        return {accessToken, refreshToken}

    } catch (error) {

        throw new ApiError(500," something went wrong while accessing token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user detail from frontend
    // validation - not empty field
    // check if user already exits : use username or email to check
    // check for images, check for avatar
    // uplaod them to cloudinary, avatar 
    // create user object - create entry in db
    // remove password and refresh token field from response , after creation in mongodb response is return back to us
    // check for user creation , if created or not in db
    // return res


// get user detail from frontend
    const {fullname, email, username, password} = req.body
    console.log("email:", email);
 
// validation - not empty field

    // if(fullname === ""){   we can use this code for all values but other also is good
        // throw new ApiError(400, "fullname is required")  
    // }
    if(
        [fullname, email, username, password].some((field) => 
            field?.trim() === ""  )    //agr field hai to trim kr do agr trim ke baad bhi empty to true return hoga mtlb field khali hai
        ) {
            throw new ApiError(400," All fields are required")
        }
    

// check if user already exits : use username or email to check
    const existedUser = await User.findOne({ //can also check like user.finone(email etc but to check all field)
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exits")
    }

    console.log(req.files);
// check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path; 
    console.log("path is :", avatarLocalPath)  //multer ne jo file li hai 
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.
        coverImage) && req.files.coverImage.length > 0
     ) {coverImageLocalPath = req.files.coverImage[0].path
        
    } 
      

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatarfile is required")
    }

// uplaod them to cloudinary, avatar 
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("url", avatar)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Not uploaded on cloudinary")
    }


// create user object - create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url ||  "",
        email,
        password,
        username:username.toLowerCase()
      })

// remove password and refresh token field from response , after creation in mongodb response is return back to us
    const createdUser = await User.findById(user._id).select(
        "-password -refreshTOken"   // jo return nahi krane
    )


// check for user creation , if created or not in db
    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
    }

// return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )


})

const loginUser = asyncHandler(async (req, res)=>{
    // req.body ->data
    // get email id and username 
    // find the user
    // password check
    // pass access and refresh token 
    // send in the form of cookies

    const {email, username, password} = req.body

    
    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }
    

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user does not exit")
    }
    
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log(isPasswordValid);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password is typed")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedinuser = await User.findById(user._id).
    select("-password -refresh")

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options )
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user: loggedinuser, accessToken,
                refreshToken
            },
            "user logged in successfully"
        )
        
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },{
            new: true
        }
    )

    const options = {
        httponly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {},"user logged out successfully"))
})

const refreshAccessToken = asyncHandler (async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

try {
        const decodedToken = jwt.verify(incomingRefreshToken, 
            process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "invalid refrsh token")
        }
    
        if(incomingRefreshToken != user?.refreshToken){
            throw new ApiError(401, "used or expired refresh token")
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken:newrefreshToken},
                "Access token refreshed successfully"
            )
        )
    
} catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh Token")
}})


export {
    registerUser,
    loginUser,
    logoutUser, 
    refreshAccessToken
}