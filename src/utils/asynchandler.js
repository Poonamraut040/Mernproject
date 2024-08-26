const asyncHandler = (requesthandler) => {   //promises
    return (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next))
        .catch((err)=>next(err))            //if rejected
    }
} 
// ye isliye hai ki jab hum controller likhe to har e=request ko hum try catch me nahi dalna pdega ye khud se ek promise likhke send kr dega
//it is higher order function which teke function as a parameter
export {asyncHandler}



// const asyncHandler = (fn) => async(req, res, next) => {     jo fn liya as a parameter usko phirse ek function me pass kiya
    // try{
        // await fn(req, res, next)
    // }
    // catch(error){
        // res.status(err.code || 500).json({
            // success:false,
            // message:err.message
        // })
    // }
// }