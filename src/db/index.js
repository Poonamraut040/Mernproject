import mongoose from "mongoose";


const connectDB = async ()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/Owner')
        .then(()=>{
            console.log("mongodb connected");
        })
    }catch(error){
        console.error("mongodb connection error", error);
        process.exit(1);
    }
}
export default connectDB ;