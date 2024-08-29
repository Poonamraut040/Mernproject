import multer from "multer";
import path from "path"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, '../../public/photos'))   // aha se hume photo ki full path mil jayegi as a file name aur usko hum storage ke naam se as amiddleware use krege
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
})


export const upload = multer({
    storage,
})

//multer is use for taking file from local storage and then use this file to upload on cloudinary

