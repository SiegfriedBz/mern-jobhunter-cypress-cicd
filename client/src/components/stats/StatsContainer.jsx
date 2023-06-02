import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa'
import StatItem from './StatItem'
import { useJobsContext } from '../../contextAPI/context'

const StatsContainer = () => {
  const { stats } = useJobsContext()
  const icons = [
    <FaSuitcaseRolling key="1" />,
    <FaSuitcaseRolling key="2" />,
    <FaCalendarCheck key="first3" />,
    <FaBug key="4" />,
  ]

  const defaultStats = stats.map((stat, index) => {
    const title = Object.keys(stat)[0]
    const count = stat[title]
    return {
      key: index,
      title,
      count: count || 0,
      icon: icons[index],
    }
  })

  return (
    <>
      <h4 className="mx-auto">Dashboard</h4>
      <div className="stats-container">
        {defaultStats?.length > 1 &&
          defaultStats.map((stat) => (
            <StatItem
              key={stat.key}
              title={stat.title}
              count={stat.count}
              icon={stat.icon}
            />
          ))}
      </div>
    </>
  )
}

export default StatsContainer
