require('dotenv').config()
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const JWT_LIFETIME = process.env.JWT_LIFETIME
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} = require('../middleware/errors/customErrors')
const geoCode = require("../services/geoCode");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 3,
        maxlength: 20,
        trim: true
    },
    lastName: {
        type: String,
        maxlength: 20,
        default: 'Last Name'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // will NOT be returned when we query for a user (.findOne() for example), EXCEPT when we use .create() or .save() methods
    },
    location: {
        address: {
            type: String,
            maxlength: 50,
            trim: true,
            default: 'Valletta Malta',
            required: true // can create a user without providing a location, but if we do provide a location, it must have an address
        },
        coordinates: {
            type: [Number],
            default: [14.5141, 35.8992]
        }
    }
})

//* user instance methods
UserSchema.methods.createToken = function() {
    return jwt.sign({ userId: this._id }, JWT_SECRET, { expiresIn: JWT_LIFETIME })
}

//* user class methods
UserSchema.statics.registerUser = async function(newUser) {

    console.log('statics.registerUser')

    const {name, email, password, location } = newUser
    console.log('newUser', newUser)

    if(!name || !email || !password) {
        throw new BadRequestError('Please provide a name, email, and password')
    }

    if(!validator.isEmail(email)) {
        throw new BadRequestError('Please use a valid email')
    }

    if(!validator.isStrongPassword(password)) {
        throw new BadRequestError('Please use a strong password')
    }

    const exists = await this.findOne({ email: email })
    if(exists) {
        throw new BadRequestError('Email already taken, please try again')
    }

    let newUserObj = { ...newUser }

    if(location?.address) {
        const coordinates = await geoCode(location.address)
        newUserObj.location = {
            address: location.address,
            coordinates
        }
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await this.create({ ...newUserObj, password: hashPassword })

    if(!user) {
        throw new Error('Something went wrong, please try again')
    }

    const token = user.createToken()
    if(!token) {
        throw new Error('Something went wrong with credentials, please try again')
    }

    // get rid of password in response
    user.password = undefined

    return { user, token}
}

UserSchema.statics.loginUser = async function(userCredentials) {

    const { email, password } = userCredentials

    if(!email || !password) {
        throw new BadRequestError('Please provide an email and password')
    }

    if(!validator.isEmail(email)) {
        throw new BadRequestError('Please use a valid email')
    }

    const user = await this.findOne({ email: email }).select('+password')

    if(!user) {
        throw new NotFoundError('User not found, please try again')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch) {
        throw new UnauthorizedError('Password does not match email, please try again')
    }

    const token = user.createToken()
    if(!token) {
        throw new Error('Something went wrong with credentials, please try again')
    }

    // get rid of password in response
    user.password = undefined
    return { user, token }
}

// authenticated user
UserSchema.statics.updateUser = async function(changedUser) {

    const { userId, ...rest } = changedUser
    const { name, email, password, location } = rest

    const user = await this.findById(userId)

    if(email && !validator.isEmail(email)) {
        throw new BadRequestError('Please use a valid email')
    }

    if(password && !validator.isStrongPassword(password)) {
        throw new BadRequestError('Please use a strong password')
    }

    if(user.email !== email) {
        const emailAlreadyTaken = await this.findOne({ email })
        if(emailAlreadyTaken) {
            throw new BadRequestError('This email is already taken, please use another one')
        }
    }

    let newUserObj = { ...changedUser }

    if(password) {
        const salt = await bcrypt.genSalt(10)
        newUserObj.password = await bcrypt.hash(password, salt)
    }

    if(location?.address) {
        const coordinates = await geoCode(location.address)
        newUserObj.location = {
            address: location.address,
            coordinates
        }
    } else {
        newUserObj.location = user.location
    }

    Object.keys(rest)
        .filter(key => key !== 'location')
        .filter(key => key !== 'password')
        .forEach(key => {
            return newUserObj[key] = rest[key]
        })

    const updatedUser = await this.findOneAndUpdate({ _id: userId },
        { ...newUserObj },
        { new: true, runValidators: true } // run the validators ONLY on the newUserObj fields
    )

    if(!updatedUser) {
        throw new Error('Something went wrong while updating the user, please try again')
    }

    // refresh User JWT
    const newToken = updatedUser.createToken()
    if(!newToken) {
        throw new Error('Something went wrong with credentials, please try again')
    }

    // TO CHECK: password should not be in user object, since we used
    /// findOneAndUpdate which doesn t call .save ??? && select: false in schema
    ///// otherwise get rid of password in response
    /////// user.password = undefined

    return { updatedUser, newToken }
}

module.exports = mongoose.model('User', UserSchema)
