import { Link } from 'react-router-dom'
import errorImg from '../assets/images/not-found.svg'

const Error = () => {
    return (
        <div className='error full-page'>
            <img src={errorImg} alt="not-found"/>
            <h3>Ohh Page Not Found</h3>
            <p>We can't seem to find the page you're looking for</p>
            <Link to='/'>Back Home</Link>
        </div>
    )
}
export default Error
