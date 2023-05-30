require('dotenv').config()
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const JWT_LIFETIME = process.env.JWT_LIFETIME
const {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError
} = require('../middleware/errors/customErrors')

const authenticateMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new BadRequestError('Authentication is required')
    }

    try {
        const [_, token] = authHeader.split(' ')

        if(!token) {
           throw new UnauthorizedError('Authentication token is required')
        }

        jwt.verify(token, JWT_SECRET, (error, data) => {
            if(error) {
                throw new ForbiddenError('Authentication failed')
            }

            const { userId } = data
            if(!userId) {
                throw new ForbiddenError('Authentication failed')
            }

            req.userId = userId
            next()
        })
    } catch (error) {
        throw error
    }
}

module.exports = authenticateMiddleWare
