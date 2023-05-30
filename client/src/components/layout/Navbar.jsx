import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext, useUserContext } from '../../contextAPI/context'

import Logo from '../utils/Logo'
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa'

const Navbar = () => {

    const { toggleSideBar } = useAppContext()
    const { user, clearUser } = useUserContext()

    const [showDropdown, setShowDropdown] = useState(false)

    return (
       <div className='navbar'>
           <div className="nav-center">
                <button
                    className='toggle-btn'
                    onClick={() => {toggleSideBar()}}
                >
                    <FaAlignLeft />
                </button>
               <div>
                   <Logo />
               </div>
               <div className="btn-container">
                   <button
                       className="btn"
                       onClick={() => {setShowDropdown(prev => !prev)}}
                   >
                       <FaUserCircle/>
                       {user?.name}
                       <FaCaretDown/>
                   </button>
                   <div className={showDropdown ? 'dropdown show-dropdown' : 'dropdown'}>
                       <button
                           onClick={() => {clearUser()}}
                           className="dropdown-btn"
                       >
                           Logout
                       </button>
                   </div>
               </div>
           </div>
       </div>
    )
}
export default Navbar
