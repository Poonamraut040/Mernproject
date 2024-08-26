const asyncHandler = (requesthandler) => {   //promises
    (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next))
        .catch((err)=>next(err))            //if rejected
    }
} 


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