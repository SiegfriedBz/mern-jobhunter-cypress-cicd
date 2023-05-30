const notFoundMiddleWare = (req, res, next) => {
    res.status(404).json({ error: 'page not found'})
}

module.exports = notFoundMiddleWare
