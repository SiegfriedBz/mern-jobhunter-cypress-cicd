import { useEffect } from "react"
import { useAppContext, useJobsContext } from "../contextAPI/context"
import { Loading, JobCard } from "../components"

const JobsContainer = () => {

    // context
    const { isLoading, setIsLoading, clearIsLoading, setFlash } = useAppContext()
    const { jobs, totalJobs, numberOfPages } = useJobsContext()

    if(isLoading) return <Loading />

    return (
        <div className='jobs-container'>
            <h5>{`${totalJobs} Job${totalJobs >1 ? "s" : ""} found`}</h5>
            <div className="jobs">
                {jobs && jobs.map(job => {
                    const { _id: jobId } = job
                    return <JobCard key={jobId} job={job}/>
                })}
            </div>
        </div>
    )
}
export default JobsContainer
