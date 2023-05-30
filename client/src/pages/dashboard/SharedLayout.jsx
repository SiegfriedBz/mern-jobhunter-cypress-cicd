import { Outlet } from 'react-router-dom'
import {
    Navbar,
    BigSideBar,
    SmallSideBar,
    MapView
} from '../../components'
import { useEffect } from "react";
import { useFetchJobsHook } from "../../hooks";

const SharedLayout = () => {

    const { getAllJobs } = useFetchJobsHook()

    // get all jobs
    useEffect(() => {
        (async() => {
            console.log('useEffect get all jobs')
            await getAllJobs()
        })()
    }, [])

    return (
        <div className='shared-layout'>
            <main className='dashboard'>
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
