import { FaTimes } from 'react-icons/fa'
import { useAppContext } from '../../contextAPI/context'
import NavLinks from './NavLinks'
import Logo from '../utils/Logo'

const SmallSideBar = () => {
  const { showSideBar, toggleSideBar } = useAppContext()

  return (
    <div className="small-side-bar">
      <div
        className={
          showSideBar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className="content">
          <button type="button" onClick={toggleSideBar} className="close-btn">
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </div>
  )
}

export default SmallSideBar
