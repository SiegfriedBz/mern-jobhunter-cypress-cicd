const loggerMiddleWare = require('./loggerMiddleWare')
const authenticateMiddleWare = require('./authenticateMiddleWare')
const notFoundMiddleWare = require('./notFoundMiddleWare')
const errorHandlerMiddleWare = require('./errors/errorHandlerMiddleWare')

module.exports = {
    loggerMiddleWare,
    authenticateMiddleWare,
    notFoundMiddleWare,
    errorHandlerMiddleWare
}
