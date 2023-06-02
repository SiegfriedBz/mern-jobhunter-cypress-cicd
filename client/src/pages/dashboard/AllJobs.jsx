import { useAppContext } from '../../contextAPI/context'
import SearchContainer from '../../components/SearchContainer'
import JobsContainer from '../../components/JobsContainer'
import FlashMessage from '../../components/utils/FlashMessage'
import Loading from '../../components/utils/Loading'

const AllJobs = () => {
  const { flash, isLoading } = useAppContext()

  if (isLoading) return <Loading />

  return (
    <div className="dashboard-form-page">
      {flash?.showFlash && <FlashMessage />}
      <SearchContainer />
      <JobsContainer />
    </div>
  )
}

export default AllJobs
