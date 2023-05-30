import { useAppContext, useUserContext, useJobsContext, useMapContext } from '../contextAPI/context'
import { StatusCodes } from 'http-status-codes'
import fetchOptions from '../utils/fetchOptions'

const SERVER_URL = 'http://localhost:3001/api/v1'

const useFetchJobsHook = () => {
    const {setFlash, setIsLoading, clearIsLoading} = useAppContext()
    const {user, token, clearUser, setUserInStorage, setUserInContext} = useUserContext()
    const {setStatsInContext, setAllJobsInContext, addJobInContext, updateJobInContext, deleteJobInContext,} = useJobsContext()
    const {setJobPopupInContext, setShowPopUpInContext,} = useMapContext()

    // fetch
    const fetchData = async({ endpoint, method='POST', body={}, authorization='', redirect, flashContent }) => {
        try {
            const url = `${SERVER_URL}/${endpoint}`

            const response = await fetch(url, fetchOptions({
                method, body, authorization }))

            const data = await response.json()

            if(response.status === StatusCodes.OK || response.status === StatusCodes.CREATED){
                const { stats, monthlyApplications, jobs, job, totalJobs, numOfPages, token: newToken } = data

                if(flashContent) {
                    setFlash({ message: flashContent })
                }

                setTimeout(() => {
                    // refresh token
                    setUserInStorage(user, newToken)
                    setUserInContext(user, newToken)

                    if(method === 'GET' && endpoint === 'jobs/stats') {
                        setStatsInContext({ stats, monthlyApplications })
                    }
                    if(method === 'GET' && endpoint === 'jobs') {
                        setAllJobsInContext({ jobs, totalJobs, numOfPages })
                    }
                    if(method === 'POST') {
                        addJobInContext({ job, totalJobs, numOfPages })
                        setJobPopupInContext(job)
                    }
                    if(method === 'PATCH') {
                        updateJobInContext({ job, totalJobs, numOfPages })
                        setJobPopupInContext(job)
                    }
                    if(method === 'DELETE') {
                        deleteJobInContext({ job, totalJobs, numOfPages })
                        setShowPopUpInContext(false)
                    }
                }, 1500)

            } else if (response.status === StatusCodes.FORBIDDEN) {
                setFlash({ type: 'danger', message: 'Your session expired, please log in' })
                clearUser()

            } else if(data && data.error) {
                setFlash({ type: 'danger', message: data.error.message })
                clearUser()
            }
        } catch (error) {
            setFlash({ type: 'danger', message: error.message })
            clearUser()
        }
    }

    const getStats = async() => {
        setIsLoading()
        const endpoint = `jobs/stats`
        const method = 'GET'
        const authorization = `Bearer ${token}`
        // const redirect = () => navigate('/') // if token expired

        if(token) {
            await fetchData({
                endpoint, method, authorization
            })
            clearIsLoading()
        } else {
            // navigate('/') // if token expired
            throw new Error('Please authenticate and try again')
        }
    }

    const getAllJobs = async() => {
        setIsLoading()
        const endpoint = `jobs`
        const method = 'GET'
        const authorization = `Bearer ${token}`
        // const redirect = () => navigate('/') // if token expired

        if(token) {
            await fetchData({
                endpoint, method, authorization
            })
            clearIsLoading()
        } else {
            // navigate('/') // if token expired
            throw new Error('Please authenticate and try again')
        }
    }

    const createJob = async(job) => {
        setIsLoading()
        delete job['_id']
        const endpoint = `jobs`
        const body = JSON.stringify(job)
        const authorization = `Bearer ${token}`
        // const redirect = () => navigate('/') // if token expired
        const flashContent = `Job was created successfully!`

        if(token) {
            await fetchData({
                endpoint, body, authorization, flashContent
            })
            clearIsLoading()
        } else {
            // navigate('/') // if token expired
            throw new Error('Please authenticate and try again')
        }
    }

    const updateJob = async(job) => {
        setIsLoading()
        const endpoint = `jobs/${job._id}`
        const method = 'PATCH'
        const body = JSON.stringify(job)
        const authorization = `Bearer ${token}`
        // const redirect = () => navigate('/') // if token expired
        const flashContent = `Job updated successfully!`

        if(token) {
            await fetchData({
                endpoint, method, body, authorization, flashContent
            })
            clearIsLoading()
        } else {
            // navigate('/') // if token expired
            throw new Error('Please authenticate and try again')
        }
    }

    const deleteJob = async(jobId) => {
        setIsLoading()
        const endpoint = `jobs/${jobId}`
        const method = 'DELETE'
        const authorization = `Bearer ${token}`
        // const redirect = () => navigate('/') // if token expired
        const flashContent = `Job deleted successfully!`

        if(token) {
            await fetchData({
                endpoint, method, authorization, flashContent
            })
            clearIsLoading()
        } else {
            // navigate('/') // if token expired
            throw new Error('Please authenticate and try again')
        }
    }

    return {
        getStats,
        getAllJobs,
        createJob,
        updateJob,
        deleteJob,
    }
}

export default useFetchJobsHook
