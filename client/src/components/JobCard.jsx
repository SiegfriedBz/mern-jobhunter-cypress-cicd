import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { useFetchJobsHook } from '../hooks'
import { useJobsContext } from '../contextAPI/context'
import JobInfo from './JobInfo'

const JobCard = ({ job }) => {
  const { setPopUpJobIdInContext } = useJobsContext()
  const { deleteJob } = useFetchJobsHook()

  const {
    _id: jobId,
    company,
    description,
    location,
    status,
    jobType,
    jobCategory,
    createdAt,
  } = job

  const handleFlyToJob = () => {
    setPopUpJobIdInContext(jobId)
  }

  const handleDeleteJob = async () => {
    await deleteJob(jobId)
  }

  const date = moment(createdAt).format('MMM Do YY')

  return (
    <div className="job">
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{description}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={location.address} />
          <JobInfo icon={<FaBriefcase />} text={status} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <JobInfo icon={<FaBriefcase />} text={jobCategory} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
        </div>
        <footer>
          <div className="actions">
            <button
              type="button"
              className="btn edit-btn"
              onClick={handleFlyToJob}
            >
              Fly to
            </button>
            <button
              type="button"
              className="btn delete-btn"
              onClick={handleDeleteJob}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default JobCard
