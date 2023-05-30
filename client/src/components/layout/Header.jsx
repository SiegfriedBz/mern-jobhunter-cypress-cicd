import React from 'react'
import {Link} from "react-router-dom";
import {Logo} from "../index";

const Header = () => {
    return (
        <div className="">
            <nav>
                <Link to='/'><Logo /></Link>
                {/*<Link to='/'>Dashboard</Link>*/}
                {/*<Link to='/register'>Register/Login</Link>*/}
                {/*<Link to='/landing'>Landing</Link>*/}
                {/*<Link to='/about'>About</Link>*/}
            </nav>
        </div>
    )
}
export default Header
