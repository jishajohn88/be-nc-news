exports.psqlErrorHandler = (error,request,response,next) => {
    if(error.code === '22P02' || error.code === '23502' || error.code === '23503' || error.code === '42703'){
        response.status(400).send({message: 'Bad request'})
    }else {
        next(error)
    }
}
exports.customErrorHandler = (error,request,response,next) => {
    if(error.status && error.message){
        response.status(error.status).send({message : error.message})
    } else {
        next(error)
    }
}
exports.serverErrorHandler = (error,request,response,next) => {
    response.status(500).send({message : "Internal server error"})
}