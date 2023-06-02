import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import BigSideBar from '../../components/layout/BigSideBar'
import SmallSideBar from '../../components/layout/SmallSideBar'
import MapView from '../../components/map/MapView'
import { useFetchJobsHook } from '../../hooks'

const SharedLayout = () => {
  const { getAllJobs } = useFetchJobsHook()

  // get all jobs
  useEffect(() => {
    ;(async () => {
      await getAllJobs()
    })()
  }, [])

  return (
    <div className="shared-layout">
      <main className="dashboard">
        <SmallSideBar />
        <BigSideBar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
            <MapView />
          </div>
        </div>
      </main>
    </div>
  )
}

export default SharedLayout
