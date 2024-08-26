import multer from "multer";


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/temp")   // yaha se hume photo ki full path mil jayegi as a file name aur usko hum storage ke naam se as amiddleware use krege
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
})


export const upload = multer({
    storage,
})

//multer is use for taking file from local storage and then use this file to upload on cloudinary