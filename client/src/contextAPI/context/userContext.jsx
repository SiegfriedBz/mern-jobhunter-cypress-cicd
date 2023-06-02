import {
  useEffect,
  createContext,
  useReducer,
  useContext,
  useCallback,
} from 'react'
import { userReducer } from '../reducers'
import { SET_USER, CLEAR_USER } from '../actions/userActions'

export const initialState = {
  user: {
    name: '',
    lastName: '',
    email: '',
    location: {
      address: 'Valletta Malta',
      coordinates: [14.5136759, 35.8989818],
    },
  },
  token: '',
}

const UserContext = createContext(null)

export const useUserContext = () => useContext(UserContext)

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  // get user from localstorage and update context
  const getUserFromStorage = () => {
    const data = window.localStorage.getItem('jobfinder')
    const userData = JSON.parse(data)

    if (userData && userData.user) {
      const { user, token } = userData
      dispatch({
        type: SET_USER,
        payload: { user, token },
      })
    }
  }

  useEffect(() => {
    getUserFromStorage()
  }, [])

  // clear user in localstorage and context
  const clearUser = () => {
    window.localStorage.removeItem('jobfinder')
    dispatch({
      type: CLEAR_USER,
      payload: initialState,
    })
  }

  const setUserInStorage = (user, token) => {
    window.localStorage.setItem('jobfinder', JSON.stringify({ user, token }))
  }

  const setUserInContext = (user, token) => {
    dispatch({
      type: SET_USER,
      payload: { user, token },
    })
  }

  const valueObject = useCallback(() => {
    return {
      ...state,
      getUserFromStorage,
      clearUser,
      setUserInStorage,
      setUserInContext,
    }
  }, [state])

  return (
    <UserContext.Provider value={valueObject()}>
      {children}
    </UserContext.Provider>
  )
}
