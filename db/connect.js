require('dotenv').config()
const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL

const connect = () => {

  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
}

module.exports = connect
