import { useEffect, createContext, useReducer, useContext } from 'react'
import { userReducer } from '../reducers'
import { SET_USER, CLEAR_USER } from '../actions'

export const initialState = {
    user: {
        name: '',
        lastName: '',
        email: '',
        location: {
            address: 'Valletta Malta',
            coordinates: [14.5136759, 35.8989818]
        },
    },
    token: ''
}

const UserContext = createContext(null)

export const useUserContext = () => {
    return useContext(UserContext)
}

export const UserContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(userReducer, initialState)

    useEffect(() => {
        console.log('useEffect getUserFromStorage')
        getUserFromStorage()
    }, [])

    // get user from localstorage and update context
    const getUserFromStorage = () => {
        const data = window.localStorage.getItem('jobfinder')
        const userData = JSON.parse(data)

        if(userData && userData.user) {
            const { user, token } = userData
            console.log('getUserFromStorage', user, token)
            dispatch({
                type: SET_USER,
                payload: { user, token }
            })
        }
    }

    // clear user in localstorage and context
    const clearUser = () => {
        window.localStorage.removeItem('jobfinder')
        dispatch({
            type: CLEAR_USER,
            payload: initialState
        })
    }

    const setUserInStorage = (user, token) => {
        window.localStorage.setItem('jobfinder',
            JSON.stringify({ user, token}))
    }

    const setUserInContext = (user, token) => {
        dispatch({
            type: SET_USER,
            payload: { user, token }
        })
    }

    return (
        <UserContext.Provider value={{
            ...state,
            getUserFromStorage,
            clearUser,
            setUserInStorage,
            setUserInContext
        }}
        >
            { children }
        </UserContext.Provider>
    )
}
