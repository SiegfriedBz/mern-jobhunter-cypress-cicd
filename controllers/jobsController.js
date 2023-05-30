const mongoose = require('mongoose')
const { Job } = require('../models')
const {
    BadRequestError,
    ForbiddenError,
    NotFoundError
} = require('../middleware/errors/customErrors')
const { StatusCodes } = require('http-status-codes')

const getUserStats = async(req, res, next) => {
    const userId = req.userId

    const { allStats, monthlyApplications, newToken } = await Job.getUserStats(userId)

    res.status(StatusCodes.OK).json({
        stats: allStats,
        monthlyApplications,
        token: newToken })
}

const getUserJobs = async(req, res, next) => {
    const userId = req.userId

    const { jobs, newToken } = await Job.getUserJobs(userId)

    const totalJobs = jobs.length
    // const numOfPages = Math.ceil(totalJobs / 10)
    const numOfPages = 1

    res.status(StatusCodes.OK).json( { jobs, totalJobs, numOfPages, token: newToken })
}

const createUserJob = async(req, res, next) => {
    req.body.userId = req.userId

    const { job, newToken } = await Job.createUserJob(req.body)

    const jobs = await Job.find({ createdBy: req.userId })
    const totalJobs = jobs.length
    // const numOfPages = Math.ceil(totalJobs / 10)
    const numOfPages = 1

    res.status(StatusCodes.CREATED).json({ job, totalJobs, numOfPages, token: newToken })
}

const updateUserJob = async(req, res, next) => {
    req.body.userId = req.userId
    const { id: jobId } = req.params

    if(!mongoose.Types.ObjectId.isValid(jobId)){
        throw new BadRequestError(`Job id ${jobId} does not exist`)
    }

    const { updatedJob, newToken } = await Job.updateUserJob(jobId, req.body)

    const jobs = await Job.find({ createdBy: req.userId })
    const totalJobs = jobs.length
    // const numOfPages = Math.ceil(totalJobs / 10)
    const numOfPages = 1

    res.status(StatusCodes.OK).json({ job: updatedJob, totalJobs, numOfPages, token: newToken })
}

const deleteUserJob = async(req, res, next) => {
    const userId = req.userId
    const { id: jobId } = req.params

    if(!mongoose.Types.ObjectId.isValid(jobId)){
        throw new BadRequestError(`Job id ${jobId} does not exist`)
    }

    const { deletedJob, newToken } = await Job.deleteUserJob(jobId, userId)

    const jobs = await Job.find({ createdBy: req.userId })
    const totalJobs = jobs.length
    // const numOfPages = Math.ceil(totalJobs / 10)
    const numOfPages = 1

    res.status(StatusCodes.OK).json({ job: deletedJob, totalJobs, numOfPages, token: newToken })
}

module.exports = {
    getUserStats,
    getUserJobs,
    createUserJob,
    updateUserJob,
    deleteUserJob
}
