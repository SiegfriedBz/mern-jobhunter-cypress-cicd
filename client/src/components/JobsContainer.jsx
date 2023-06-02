import { useAppContext, useJobsContext } from '../contextAPI/context'
import Loading from './utils/Loading'
import JobCard from './JobCard'

const JobsContainer = () => {
  const { isLoading } = useAppContext()
  const { jobs, totalJobs } = useJobsContext()

  if (isLoading) return <Loading />

  return (
    <div className="jobs-container">
      <h5>{`${totalJobs} Job${totalJobs > 1 ? 's' : ''} found`}</h5>
      <div className="jobs">
        {jobs &&
          jobs.map((job) => {
            const { _id: jobId } = job
            return <JobCard key={jobId} job={job} />
          })}
      </div>
    </div>
  )
}

export default JobsContainer
