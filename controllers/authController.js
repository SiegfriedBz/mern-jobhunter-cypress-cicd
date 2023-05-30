const { User } = require('../models')
const { StatusCodes } = require('http-status-codes')

const registerUser = async(req, res) => {
    console.log('registerUser')

    const { user, token } = await User.registerUser(req.body)
    console.log('user._id', user._id)

    res.status(StatusCodes.CREATED).json({ user, token })
}

const loginUser = async(req, res) => {
    console.log('loginUser', req.body)

    const { user, token } = await User.loginUser(req.body)

    // password is not returned if we use select: false in UserSchema
    /// here set to true

    res.status(StatusCodes.OK).json({ user, token })
}

const updateUser = async(req, res) => {
    req.body.userId = req.userId

    const { updatedUser, newToken } = await User.updateUser(req.body)

    res.status(StatusCodes.CREATED).json({ user: updatedUser, token: newToken })
}

module.exports = {
    registerUser,
    loginUser,
    updateUser
}
