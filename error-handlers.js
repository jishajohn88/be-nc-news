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