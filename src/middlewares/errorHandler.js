const HttpException = require("../exceptions/httpException")

module.exports = (err, req, res, next) => {
    if(process.env.NODE_ENV == "development"){
        console.log(err)
    }

    if(err instanceof HttpException){
        if (err.fild){
            return res.status(err.statusCode).json({message: err.message, fild: err.fild})
        } 
        return res.status(err.statusCode).json({message: err.message})
    }

    return res.status(500).json({message: "Internal error"})
}