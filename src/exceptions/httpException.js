
class HttpException extends Error {
    constructor(statusCode, message, error = null, fild = null){
        super(message)
        this.name = "HttpException"
        this.statusCode = statusCode
        this.message = message
        this.fild = fild
        this.error = error
    }
}

module.exports = HttpException