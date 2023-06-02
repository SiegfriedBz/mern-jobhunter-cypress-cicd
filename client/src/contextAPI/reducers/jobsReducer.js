/* eslint-disable no-underscore-dangle */
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

const jobsReducer = (state, action) => {
  switch (action.type) {
    case SET_STATS:
      return {
        ...state,
        stats: action.payload.stats,
        monthlyApplications: action.payload.monthlyApplications,
      }
    case SET_JOBS:
      return {
        ...state,
        jobs: action.payload.jobs,
        totalJobs: action.payload.totalJobs,
        numberOfPages: action.payload.numberOfPages,
      }
    case ADD_JOB:
      return {
        ...state,
        jobs: [...state.jobs, action.payload.job],
        totalJobs: action.payload.totalJobs,
        numberOfPages: action.payload.numberOfPages,
      }
    case UPDATE_JOB:
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job._id !== action.payload.job._id ? job : action.payload.job,
        ),
        totalJobs: action.payload.totalJobs,
        numberOfPages: action.payload.numberOfPages,
      }
    case DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter((job) => job._id !== action.payload.job._id),
        totalJobs: action.payload.totalJobs,
        numberOfPages: action.payload.numberOfPages,
      }
    case SET_EDIT_JOB_ID:
      return { ...state, editJobId: action.payload }
    case SET_IS_EDIT_MODE:
      return { ...state, isEditMode: action.payload }
    case SET_POP_UP_JOB_ID:
      return { ...state, popUpJobId: action.payload }
    default:
      return state
  }
}

export default jobsReducer
