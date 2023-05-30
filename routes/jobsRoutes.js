const express = require('express')
const { jobsController } = require('../controllers')
const {
    getUserStats,
    getUserJobs,
    createUserJob,
    updateUserJob,
    deleteUserJob
} = jobsController

const router = express.Router()

router.get('/stats', getUserStats)
router.get('/', getUserJobs)
router.post('/', createUserJob)
router.patch('/:id', updateUserJob)
router.delete('/:id', deleteUserJob)

module.exports = router
