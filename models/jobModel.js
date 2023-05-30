const mongoose = require('mongoose')
const User = require('./userModel')
const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} = require('../middleware/errors/customErrors')

const geoCode = require('../services/geoCode')
const moment = require('moment')

const JobSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        maxLength: 50,
        required: true
    },
    company: {
        type: String,
        maxLength: 30,
        required: true
    },
    jobType: {
        type: String,
        enum: {
            values: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
            default: 'full-time',
            message: `Job type {VALUE} is not supported`
        }
    },
    jobCategory: {
        type: String,
        enum: {
            values: ['on-site', 'hybrid', 'remote'],
            default: 'remote',
            message: `Job category {VALUE} is not supported`
        }
    },
    status: {
        type: String,
        enum: {
            values: ['offer received', 'interview', 'declined', 'pending'],
            default: 'pending',
            message: `Status {VALUE} is not supported`
        }
    },
    location: {
        address: {
            type: String,
            maxlength: 50,
            trim: true,
            default: 'Company City',
            required: true // can create a job without providing a location, but if we do provide a location, it must have an address
        },
        coordinates: {
            type: [Number]
        }
    }
}, { timestamps: true })

//* helper functions
const checkUserPermissions = (job, userId) => {
   return job.createdBy.toString() === userId
}

const refreshUserToken = async (userId) => {
    const user = await User.findOne({ _id: userId })
    return await user.createToken()
}

//* job class methods
JobSchema.statics.getUserStats = async function(userId) {

    let stats = await this.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    if(!stats){
        throw new NotFoundError('No stats found')
    }

    // stats contains only data for the statuses with counts > 0
    stats = stats.reduce((acc, curr) => {
        const { _id: status, count } = curr
        acc[status] = count
        return acc
    }, {})

    const allStatus = ['interview', 'declined', 'pending', 'offer received']
    // allStats contains data for all statuses (count >= 0)
    const allStats = allStatus.map((status) => {
        return {
            [status]: stats[status] || 0
        }
    })

    let monthlyApplications = await this.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
        { $group: {
            _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ])

    monthlyApplications = monthlyApplications
        .map((item) => {
            const {_id: {year, month}, count} = item
            const date = moment()
                .month(month - 1)
                .year(year)
                .format('MMM YY')
            return { count, date }
        })
        .reverse()

    //refresh User JWT
    const newToken = await refreshUserToken(userId)
    if(!newToken) {
        throw new Error('Something went wrong with credentials, please try again')
    }

    return { allStats, monthlyApplications, newToken }
}

JobSchema.statics.getUserJobs = async function(userId) {
    const jobs = await this.find({ createdBy: userId })

    //refresh User JWT
    const newToken = await refreshUserToken(userId)
    if(!newToken) {
        throw new Error('Something went wrong with credentials, please try again')
    }

    return { jobs, newToken }
}

JobSchema.statics.createUserJob = async function(jobArgs) {
    const { userId, ...rest } = jobArgs

    const newJobObject = {
        createdBy: userId,
        ...rest
    }

    if(!userId) {
        throw new BadRequestError('User credentials required, please try again')
    }

    if(!newJobObject.description) {
        throw new BadRequestError('Job\'s description required, please try again')
    }

    if(!newJobObject.company) {
        throw new BadRequestError('Job\'s company required, please try again')
    }

    if(!newJobObject.location?.address) {
        throw new BadRequestError('Job\'s address required, please try again')
    }

    const coordinates = await geoCode(newJobObject.location.address)
    newJobObject.location = {
        address: newJobObject.location.address,
        coordinates
    }

    const job = await this.create({...newJobObject})
    if(!job) {
        throw new Error('Something went wrong while creating the job, please try again')
    }

    //refresh User JWT
    const newToken = await refreshUserToken(userId)
    if(!newToken) {
        throw new Error('Something went wrong with credentials, please try again')
    }

    return { job, newToken }
}

JobSchema.statics.updateUserJob = async function(jobId, jobArgs) {
    const { userId, ...rest } = jobArgs

    if(!userId) {
        throw new BadRequestError('User credentials required, please try again')
    }

    const job = await this.findOne({ _id: jobId })
    if (!job) {
        throw new NotFoundError('No job found with this id')
    }

    const authorized = checkUserPermissions(job, userId)
    if (!authorized) {
        throw new UnauthorizedError('You are not authorized to update this job')
    }

    const newJobObject = { ...rest }

    if(!newJobObject.description) {
        throw new BadRequestError('Job\'s description required, please try again')
    }

    if(!newJobObject.company) {
        throw new BadRequestError('Job\'s company required, please try again')
    }

    // check if object has location property and if it has an address property
    if(newJobObject.location && newJobObject.location?.address === '') {
        throw new BadRequestError('Job\'s address required, please try again')
    }

    // if location property exists and address is different from the one in the DB, then we need to geocode the new address
    if(newJobObject.location && job.location.address !== newJobObject.location.address) {
        const coordinates = await geoCode(newJobObject.location.address)
        newJobObject.location = {
            address: newJobObject.location.address,
            coordinates
        }
    } else {
        newJobObject.location = job.location
    }

    const updatedJob = await this.findOneAndUpdate(
        { _id: jobId },
        { ...newJobObject },
        {
            new: true,
            runValidators: true // run the validators ONLY on the newJobObject fields
        })
    if(!updatedJob) {
        throw new Error('Something went wrong while updating the job, please try again')
    }

    //refresh User JWT
    const newToken = await refreshUserToken(userId)
    if(!newToken) {
        throw new Error('Something went wrong with credentials, please try again')
    }

    return { updatedJob, newToken }
}

JobSchema.statics.deleteUserJob = async function(jobId, userId) {

    const job = await this.findOne({ _id: jobId })
    if (!job) {
        throw new NotFoundError('No job found with this id')
    }

    const authorized = checkUserPermissions(job, userId)
    if (!authorized) {
        throw new UnauthorizedError('You are not authorized to update this job')
    }

    const deletedJob = await this.findOneAndDelete({
        createdBy: userId, _id: jobId
    }, { returnDocument: 'after' })
    if(!deletedJob) {
        throw new Error('Something went wrong while deleting the job, please try again')
    }

    //refresh User JWT
    const newToken = await refreshUserToken(userId)
    if(!newToken) {
        throw new Error('Something went wrong with credentials, please try again')
    }

    return { deletedJob, newToken }
}

module.exports = mongoose.model('Job', JobSchema)
