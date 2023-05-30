const loggerMiddleWare = (req, res, next) => {
    console.log('---------')
    console.log(req.method, req.url)
    console.log('---------')
    next()
}

module.exports = loggerMiddleWare
