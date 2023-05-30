import React from 'react'
import { StatItem } from '../index'
import { useJobsContext } from '../../contextAPI/context'
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa'

const StatsContainer = () => {
    const { stats } = useJobsContext()
    const icons = [
        <FaSuitcaseRolling />,
        <FaSuitcaseRolling />,
        <FaCalendarCheck />,
        <FaBug />
    ]

    const defaultStats = stats.map((stat, index) => {
        const title = Object.keys(stat)[0]
        const count = stat[title]
        return {
            title,
            count: count || 0,
            icon: icons[index]
        }
    })

    return (
        <>
            <h4 className='mx-auto'>Dashboard</h4>
            <div className='stats-container'>
                {defaultStats?.length > 1 && defaultStats.map((stat, index) => {
                    return <StatItem key={index} { ...stat } />
                })
                }
            </div>
        </>

    )
}
export default StatsContainer
