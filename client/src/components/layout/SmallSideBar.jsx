import { useAppContext } from '../../contextAPI/context'
import { NavLinks } from '../index'
import Logo from "../utils/Logo"
import { FaTimes } from "react-icons/fa"

const SmallSideBar = () => {

    const { showSideBar, toggleSideBar } = useAppContext()

    return (
        <div className='small-side-bar'>
            <div className={showSideBar ? 'sidebar-container show-sidebar' : 'sidebar-container'}>
                <div className="content">
                    <button
                        onClick={toggleSideBar}
                        className="close-btn"
                    >
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
