import { useAppContext } from '../../contextAPI/context'
import { NavLink } from "react-router-dom"
import links from "../../utils/links"

const NavLinks = () => {

    const { toggleSideBar } = useAppContext()

    return (
            <div className="nav-links">
                {links && links.map(link => {
                    const {id, text, icon, path} = link
                    return (
                        <NavLink
                            key={id}
                            to={path}
                            end
                            className={({isActive}) => (
                            isActive ? 'nav-link active' : 'nav-link'
                            )}
                            onClick={toggleSideBar}
                        >
                            <span className="icon">{icon}</span>
                            <span>{text}</span>
                        </NavLink>
                    )
                })
                }
            </div>
        )
}

export default NavLinks
