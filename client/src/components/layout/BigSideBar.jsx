import { useAppContext } from '../../contextAPI/context'
import { Logo, NavLinks } from '../index'

const BigSideBar = () => {

    const { showSideBar } = useAppContext()

    return (
        <div className='big-side-bar'>
            <div className={showSideBar ?
                'sidebar-container show-sidebar'
                : 'sidebar-container'
            }>
                <div className="content">
                    <header>
                        <Logo />
                    </header>
                    <NavLinks />
                </div>
            </div>
        </div>
    )
}
export default BigSideBar
