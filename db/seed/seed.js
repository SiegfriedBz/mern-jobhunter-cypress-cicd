const connectDB = require('../connect')
const { User, Job } = require('../../models')
const { jobAddresses, getRandomJob } = require('./seedJobsHelper')
const bcrypt = require('bcrypt')

const NODE_ENV = process.env.NODE_ENV
const MONGO_URL_DEV = process.env.MONGO_URL_DEV

const userMock = {
  name: 'Siegfried Wu',
  email: 'siegfried.wu@example.com',
  password: 'FakerPassword123456$$$'
}

const seed = async () => {

  if(NODE_ENV === 'production') {
    console.log(`${NODE_ENV} environment detected`)
    console.log('********** SEEDING ABORTED **********')
    return
  }

  console.log('********** SEEDING DB **********')
  try {
    // connect to db
    console.log(`Connecting to mongo ${NODE_ENV} DB...`)
    await connectDB(MONGO_URL_DEV)

    console.log(`Connecting to mongo ${NODE_ENV} DB...DONE`)
    console.log('-------------------')

    // delete all users in db
    console.log('Deleting all users')
    await User.deleteMany()

    console.log('Deleting all users...DONE')
    console.log('-------------------')

    // create new user
    console.log('Creating new user...')
    console.log(`userMock name: ${userMock.name}`)
    console.log(`userMock email: ${userMock.email}`)
    console.log(`userMock password: ${userMock.password}`)

    console.log('Hashing password...')
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(userMock.password, salt)
    console.log('Hashing password...DONE')

    const newUser = await User.create({ ...userMock, password: hashPassword })
    console.log(`New user ${newUser.name} successfully created in db`)

    console.log('Creating new user...DONE')
    console.log('-------------------')

    // create jobs mock
    console.log(`Generating jobs mock for user ${newUser.name}...`)
    const jobsMockPromises = jobAddresses.map(address => getRandomJob(newUser._id, address))
    const jobsMock = await Promise.all(jobsMockPromises)

    console.log(`Generating ${jobsMock.length} jobs mock...DONE`)
    console.log('-------------------')

    // delete all jobs
    console.log('Deleting all jobs in db...')
    await Job.deleteMany()

    console.log('Deleting all jobs in db...DONE')
    console.log('-------------------')

    // create new jobs
    console.log('Creating new jobs...')
    const newJobs = await Job.create(jobsMock)

    console.log(`Creating ${newJobs.length} new jobs...DONE`)
    console.log('-------------------')

    console.log('********** SEEDING COMPLETED **********')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

seed()
