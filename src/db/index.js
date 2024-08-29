

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Owner');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure code
    }
};

export default connectDB;














// import mongoose from "mongoose";


// const connectDB = async ()=>{
//     try{
//         await mongoose.connect('mongodb://127.0.0.1:27017/Owner')
//         .then(()=>{
//             console.log("mongodb connected");
//         })
//     }catch(error){
//         console.error("mongodb connection error", error);
//         process.exit(1);
//     }
// }
// export default connectDB ;