import dotenv from "dotenv";
import connectDB from './db/index.js';
import { app } from './app.js';
// import { Owner } from './models/owner.js';

dotenv.config({   //to access the env file
    path:'./.env'
})

connectDB()
.then(()=>{
    
    app.listen(process.env.PORT || 8000,() =>{  //server is listening i.e code will execeute on this port
        console.log(`server is running at port: ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongodb connection failed",err);
})
















// const createOwner = async () => {
    // try {
        // const newOwner = new Owner({
            // UserName: 'JohnDoe',
            // emailID: 'johndoe@example.com',
            // password: 'securepassword',
            // documents: Buffer.from('sample document data'), // Replace with actual data
            // aadharNo: 123456789012,
        // });
// 
        // const savedOwner = await newOwner.save();
        // console.log("Owner created and saved:", savedOwner);
    // } catch (error) {
        // console.error("Error creating owner:", error);
    // }
// };
// 
//  

// createOwner();
// 
















// const app = express()
// const PORT = 8000;
// 
// (async()=>{
    // try{
        // mongoose.connect('mongodb://127.0.0.1:27017/test')
        // .then(()=>{
            // console.log("Mongodb connected");
        // })
        // app.on("error",(error)=>{
            // console.log("err:", error);
            // throw error
        // })
        // app.listen(PORT,()=>{
            // console.log(`App is listening on port: ${PORT}`);
        // })
    // }catch(error){
        // console.error("ERROR:", error)
        // throw err
    // }
// })()