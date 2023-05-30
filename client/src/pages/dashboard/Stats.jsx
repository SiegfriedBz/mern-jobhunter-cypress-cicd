import { useEffect } from "react";
import { useFetchJobsHook } from '../../hooks'
import { useAppContext, useJobsContext } from '../../contextAPI/context'
import {
    StatsContainer,
    ChartsContainer,
    Loading
} from '../../components'

const Stats = () => {

    const { getStats } = useFetchJobsHook()
    const { stats, monthlyApplications } = useJobsContext()
    const { isLoading } = useAppContext()

    // get jobs stats
    useEffect(() => {
        (async() => {
            await getStats()
        })()
    }, [])

    if(isLoading) return <Loading  />

    console.log('monthlyApplications', monthlyApplications)

    return (
        <>
            <StatsContainer />
            {monthlyApplications &&
                <ChartsContainer />
            }
        </>
    )
}
export default Stats
