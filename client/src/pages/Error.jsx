import { Link } from 'react-router-dom'
import errorImg from '../assets/images/not-found.svg'

const Error = () => {
  return (
    <div className="error full-page">
      <img src={errorImg} alt="not-found" />
      <h3>Ohh Page Not Found</h3>
      <p>We can&rsquo;t seem to find the page you&rsquo;re looking for</p>
      <Link to="/">Back Home</Link>
    </div>
  )
}
export default Error
