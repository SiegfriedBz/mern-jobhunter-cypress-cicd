import { useUserContext } from "../contextAPI/context"
import { Link } from 'react-router-dom'
import main from  '../assets/images/main.svg'
// import { Logo } from '../custom'

const Home = () => {

    const { token, clearUser } = useUserContext()

    return (
        <div className='home-page'>
            {/*<Link to='/'><Logo /></Link>*/}
            <div className="container page">
                <div className="info">
                    <h1>job{" "}<span>tracking</span>{" "}app</h1>
                    <p>
                        I'm baby neutral milk hotel YOLO jean shorts drinking vinegar, same lumbersexual hot chicken polaroid scenester banh mi messenger bag ramps taiyaki. Vinyl air plant occupy activated charcoal, lumbersexual photo booth whatever seitan try-hard gentrify squid cornhole cronut copper mug. Same quinoa cold-pressed, ugh vice waistcoat bicycle rights hell of 90's jawn pok pok cray paleo twee. Bodega boys biodiesel fixie iceland 3 wolf moon tumeric. Ascot godard solarpunk blackbird spyplane taiyaki you probably haven't heard of them health
                    </p>
                    <Link
                        to='/register'
                        className='btn btn-hero'
                    >Login/register
                    </Link>
                    {token &&
                        <>
                            <Link
                                to='/dashboard'
                                className='btn btn-hero'
                            >Dashboard
                            </Link>
                            <button
                                className='btn btn-hero'
                                onClick={() => {clearUser()}}
                            >Logout
                            </button>
                        </>
                    }
                </div>
                <img src={main} className='img main-img' alt='job hunt'/>
            </div>
        </div>
    )
}

export default Home
