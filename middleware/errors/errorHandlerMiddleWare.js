const { StatusCodes } = require('http-status-codes')
const { CustomError } = require('./customErrors')

const errorHandlerMiddleWare = (error, req, res, next) => {

    const defaultError = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong, please try again later'
    }

    if(error.name === 'ValidationError') {
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.message = Object.values(error.errors)
            .map(e => e.message)
            .join(', ')
    }

    else if(error instanceof CustomError) {
        return res.status(error.statusCode).json({
            error: { message: error.message } })
    }

    res.status(defaultError.statusCode).json({
        error: { message: defaultError.message }})
}

module.exports = errorHandlerMiddleWare
