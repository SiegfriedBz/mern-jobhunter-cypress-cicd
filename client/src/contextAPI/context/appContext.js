import { createContext, useReducer, useContext } from 'react'
import { appReducer } from '../reducers'
import {
    SET_IS_LOADING,
    CLEAR_IS_LOADING,
    SET_FLASH,
    CLEAR_FLASH,
    TOGGLE_SIDE_BAR } from '../actions'

export const initialState = {
    isLoading: false,
    flash: {
        type: 'success',
        message: 'All is good',
        showFlash: false
    },
    showSideBar: false
}

const AppContext = createContext(null)

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState)

    const setFlash = ({ type='success', message='All is good' }={
        type: 'success', message: 'All is good' }) => {
        dispatch({
            type: SET_FLASH,
            payload: { type, message }
        })
        clearFlash()
    }

    const clearFlash = () => {
        setTimeout(() => {
            dispatch({
                type: CLEAR_FLASH
            })
        }, 3000)
    }

    const setIsLoading = () => {
        dispatch({
            type: SET_IS_LOADING
        })
    }

    const clearIsLoading = () => {
        dispatch({
            type: CLEAR_IS_LOADING
        })
    }

    const toggleSideBar = () => {
        dispatch({
            type: TOGGLE_SIDE_BAR
        })
    }

    return (
        <AppContext.Provider value={{
            ...state,
            setIsLoading,
            clearIsLoading,
            setFlash,
            toggleSideBar
        }}
        >
            { children }
        </AppContext.Provider>
    )
}
