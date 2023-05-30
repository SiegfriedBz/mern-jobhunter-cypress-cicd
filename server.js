require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors = require('cors') // not needed in development only?, we use proxy in client package.json
const connectDB = require('./db/connect')
const { authRoutes, jobsRoutes } = require('./routes')
const {
    loggerMiddleWare,
    authenticateMiddleWare,
    notFoundMiddleWare,
    errorHandlerMiddleWare
} = require('./middleware')

// ENV
const NODE_ENV = process.env.NODE_ENV
const PORT = NODE_ENV === 'development' ?
    3001
    : NODE_ENV === 'production' ?
        process.env.PORT
        : null

// extra packages

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(loggerMiddleWare)
app.use(express.static('./build'))

// routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/jobs', authenticateMiddleWare, jobsRoutes)

// middleware
app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleWare)

// start
const start = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Connected to ${NODE_ENV} DB & Server listening to PORT ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()
