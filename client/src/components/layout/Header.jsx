import { Link } from 'react-router-dom'
import Logo from '../utils/Logo'

const Header = () => {
  return (
    <nav>
      <Link to="/">
        <Logo />
      </Link>
    </nav>
  )
}

export default Header
