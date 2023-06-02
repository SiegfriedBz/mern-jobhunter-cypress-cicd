import { useEffect } from 'react'
import { useFetchJobsHook } from '../../hooks'
import { useAppContext, useJobsContext } from '../../contextAPI/context'
import StatsContainer from '../../components/stats/StatsContainer'
import ChartsContainer from '../../components/stats/ChartsContainer'
import Loading from '../../components/utils/Loading'

const Stats = () => {
  const { getStats } = useFetchJobsHook()
  const { monthlyApplications } = useJobsContext()
  const { isLoading } = useAppContext()

  // get jobs stats
  useEffect(() => {
    ;(async () => {
      await getStats()
    })()
  }, [])

  if (isLoading) return <Loading />

  return (
    <>
      <StatsContainer />
      {monthlyApplications && <ChartsContainer />}
    </>
  )
}

export default Stats
