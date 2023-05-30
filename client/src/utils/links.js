import { IoBarChartSharp } from 'react-icons/io5'
import { MdQueryStats } from 'react-icons/md'
import { FaWpforms } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'

const links = [
    { id: 1, text: 'Stats', icon: <IoBarChartSharp/>, path: '/dashboard' },
    { id: 2, text: 'Profile', icon: <ImProfile/>, path: '/dashboard/profile' },
    { id: 3, text: 'All Jobs', icon: <MdQueryStats/>, path: '/dashboard/all-jobs' },
    { id: 4, text: 'Add Job', icon: <FaWpforms/>, path: '/dashboard/add-job' }
]

export default links
