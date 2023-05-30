import { useUserContext } from '../../contextAPI/context'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { token } = useUserContext()

    if(!token) return <Navigate to='/' replace={true} />

    return (
        <>{ children }</>
    )
}
export default ProtectedRoute
