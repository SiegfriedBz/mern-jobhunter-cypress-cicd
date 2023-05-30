import { createContext, useContext, useReducer } from 'react'
import { jobsReducer } from '../reducers'
import {
    jobTypeOptions,
    jobCategoryOptions,
    statusOptions
} from '../../utils/jobOptions'
import {
  SET_STATS,
  SET_JOBS,
  ADD_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  SET_EDIT_JOB_ID,
  SET_IS_EDIT_MODE } from '../actions'

export const initJobState = {
    _id: "1",
    description: '',
    company: '',
    jobType: jobTypeOptions[0],
    jobCategory: jobCategoryOptions[0],
    status: statusOptions[0],
    location: {
        address: '',
        coordinates: []
    }
}

export const initAllJobsState = {
    jobs: [
        {
            _id: "1",
            description: '',
            company: '',
            jobType: jobTypeOptions[0],
            jobCategory: jobCategoryOptions[0],
            status: statusOptions[0],
            location: {
                address: '',
                coordinates: []
            }
        }
    ],
    stats: [],
    monthlyApplications: null,
    totalJobs: 1,
    numOfPages: 1,
    isEditMode: false,
    editJobId: null
}

export const JobsContext = createContext(null)

export const useJobsContext = () => {
    return useContext(JobsContext)
}

export const JobsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(jobsReducer, initAllJobsState)

   const setStatsInContext = ({ stats, monthlyApplications }) => {
       console.log('setStatsInContext')
        dispatch({
            type: SET_STATS,
            payload: { stats, monthlyApplications }
        })
   }

    const setAllJobsInContext = ({ jobs, totalJobs, numberOfPages}) => {
        console.log('setAllJobsInContext')
        dispatch({
            type: SET_JOBS,
            payload: { jobs, totalJobs, numberOfPages }
        })
    }

    const addJobInContext = ({ job, totalJobs, numberOfPages }) => {
        dispatch({
            type: ADD_JOB,
            payload: { job, totalJobs, numberOfPages }
        })
        setIsEditModeInContext(true)
        setEditJobIdInContext(job._id)
    }

    const updateJobInContext = ({ job, totalJobs, numberOfPages }) => {
        dispatch({
            type: UPDATE_JOB,
            payload: { job, totalJobs, numberOfPages }
        })
        setIsEditModeInContext(true)
        setEditJobIdInContext(job._id)
    }

    const deleteJobInContext = ({ job, totalJobs, numberOfPages }) => {
        dispatch({
            type: DELETE_JOB,
            payload: { job, totalJobs, numberOfPages }
        })
        setIsEditModeInContext(false)
        setEditJobIdInContext(null)
    }

    const setIsEditModeInContext = (value=true) => {
        dispatch({
            type: SET_IS_EDIT_MODE,
            payload: value
        })
    }

    const setEditJobIdInContext = (id) => {
        dispatch({
            type: SET_EDIT_JOB_ID,
            payload: id
        })
    }

    return (
        <JobsContext.Provider value={{
            ...state,
            dispatch,
            setStatsInContext,
            setAllJobsInContext,
            addJobInContext,
            updateJobInContext,
            deleteJobInContext,
            setIsEditModeInContext,
            setEditJobIdInContext
        }}>
            { children }
        </JobsContext.Provider>
    )
}
