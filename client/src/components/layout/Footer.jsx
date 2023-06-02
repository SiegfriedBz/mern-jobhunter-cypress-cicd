import { Link } from 'react-router-dom'
import Logo from '../utils/Logo'

const Footer = () => {
  return (
    <div>
      <Link to="/">
        <Logo />
      </Link>
    </div>
  )
}
export default Footer
