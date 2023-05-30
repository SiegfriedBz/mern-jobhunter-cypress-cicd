const { StatusCodes } = require('http-status-codes')

class CustomError extends Error {
    constructor(message) {
        super(message)
    }
}

class BadRequestError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST // 400
    }
}

class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED // 401
    }
}

class ForbiddenError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN // 403
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND // 404
    }
}

module.exports = {
    CustomError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError
}
