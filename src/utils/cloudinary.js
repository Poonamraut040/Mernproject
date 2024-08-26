import {v2 as cloudinary} from cloudinary;
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("file is uploaded on cloudinary",
            response.url);
            return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally
        //saved temporart file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}


//cloudinary is use to store file like images/videos we can also use local storage but it is best practice 
//this cloudinary provide a url of stored image and this url will show data to client