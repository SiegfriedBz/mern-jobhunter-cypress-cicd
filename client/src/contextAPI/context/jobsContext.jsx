/* eslint-disable no-underscore-dangle */
import { createContext, useCallback, useContext, useReducer } from 'react'
import { jobsReducer } from '../reducers'
import {
  jobTypeOptions,
  jobCategoryOptions,
  statusOptions,
} from '../../utils/jobOptions'
import {
  SET_STATS,
  SET_JOBS,
  ADD_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  SET_EDIT_JOB_ID,
  SET_IS_EDIT_MODE,
  SET_POP_UP_JOB_ID,
} from '../actions/jobsActions'

export const initAllJobsState = {
  jobs: [
    {
      _id: '1',
      description: '',
      company: '',
      jobType: jobTypeOptions[0],
      jobCategory: jobCategoryOptions[0],
      status: statusOptions[0],
      location: {
        address: '',
        coordinates: [],
      },
    },
  ],
  stats: [],
  monthlyApplications: null,
  totalJobs: 1,
  numOfPages: 1,
  isEditMode: false,
  editJobId: null,
  popUpJobId: null,
}

export const JobsContext = createContext(null)

export const useJobsContext = () => useContext(JobsContext)

export const JobsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobsReducer, initAllJobsState)

  const setStatsInContext = ({ stats, monthlyApplications }) => {
    dispatch({
      type: SET_STATS,
      payload: { stats, monthlyApplications },
    })
  }

  const setAllJobsInContext = ({ jobs, totalJobs, numberOfPages }) => {
    dispatch({
      type: SET_JOBS,
      payload: { jobs, totalJobs, numberOfPages },
    })
  }

  const setIsEditModeInContext = (value = true) => {
    dispatch({
      type: SET_IS_EDIT_MODE,
      payload: value,
    })
  }

  // id or null
  const setEditJobIdInContext = (id) => {
    dispatch({
      type: SET_EDIT_JOB_ID,
      payload: id,
    })
  }

  const addJobInContext = ({ job, totalJobs, numberOfPages }) => {
    dispatch({
      type: ADD_JOB,
      payload: { job, totalJobs, numberOfPages },
    })
    setIsEditModeInContext(true)
    setEditJobIdInContext(job._id)
  }

  const updateJobInContext = ({ job, totalJobs, numberOfPages }) => {
    dispatch({
      type: UPDATE_JOB,
      payload: { job, totalJobs, numberOfPages },
    })
    setIsEditModeInContext(true)
    setEditJobIdInContext(job._id)
  }

  const deleteJobInContext = ({ job, totalJobs, numberOfPages }) => {
    dispatch({
      type: DELETE_JOB,
      payload: { job, totalJobs, numberOfPages },
    })
    setIsEditModeInContext(false)
    setEditJobIdInContext(null)
  }

  const setPopUpJobIdInContext = useCallback((popUpJobId) => {
    dispatch({
      type: SET_POP_UP_JOB_ID,
      payload: popUpJobId,
    })
  }, [])

  return (
    <JobsContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        ...state,
        setStatsInContext,
        setAllJobsInContext,
        addJobInContext,
        updateJobInContext,
        deleteJobInContext,
        setIsEditModeInContext,
        setEditJobIdInContext,
        setPopUpJobIdInContext,
      }}
    >
      {children}
    </JobsContext.Provider>
  )
}
