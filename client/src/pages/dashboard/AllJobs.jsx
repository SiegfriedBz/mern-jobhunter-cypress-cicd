import { useAppContext } from "../../contextAPI/context"
import { SearchContainer, JobsContainer, FlashMessage, Loading } from '../../components'

const AllJobs = () => {

    const { flash, isLoading } = useAppContext()

    if(isLoading) return <Loading  />

    return (
        <div className='dashboard-form-page'>
            { flash?.showFlash && <FlashMessage /> }
            <SearchContainer />
            <JobsContainer />
        </div>
    )
}

export default AllJobs
