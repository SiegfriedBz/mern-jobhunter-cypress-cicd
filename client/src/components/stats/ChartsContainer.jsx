import { useState } from 'react'
import BarChart from './BarChart'
import AreaChart from './AreaChart'
import { useJobsContext } from '../../contextAPI/context'

const ChartsContainer = () => {
  const { monthlyApplications: data } = useJobsContext()
  const [showBarChart, setShowBarChart] = useState(true)

  const toggleChart = () => {
    setShowBarChart((prev) => !prev)
  }

  return (
    <div className="charts-container">
      <h4>Monthly Applications</h4>
      <button type="button" onClick={toggleChart}>
        {showBarChart ? 'Show Area Chart' : 'Show Bar Chart'}
      </button>
      {data && showBarChart ? (
        <BarChart data={data} />
      ) : (
        <AreaChart data={data} />
      )}
    </div>
  )
}

export default ChartsContainer
