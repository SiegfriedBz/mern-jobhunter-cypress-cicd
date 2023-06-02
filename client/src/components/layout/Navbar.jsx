import { useState } from 'react'
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa'
import { useAppContext, useUserContext } from '../../contextAPI/context'
import Logo from '../utils/Logo'

const Navbar = () => {
  const { toggleSideBar } = useAppContext()
  const { user, clearUser } = useUserContext()

  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="navbar">
      <div className="nav-center">
        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            toggleSideBar()
          }}
        >
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
        </div>
        <div className="btn-container">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setShowDropdown((prev) => !prev)
            }}
          >
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>
          <div className={showDropdown ? 'dropdown show-dropdown' : 'dropdown'}>
            <button
              type="button"
              onClick={() => {
                clearUser()
              }}
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
