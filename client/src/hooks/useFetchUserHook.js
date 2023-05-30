import { useNavigate } from "react-router-dom"
import { useAppContext, useUserContext } from '../contextAPI/context'
import { StatusCodes } from 'http-status-codes'
import fetchOptions from '../utils/fetchOptions'

const SERVER_URL = 'http://localhost:3001/api/v1'

const useFetchUserHook = () => {

    const {
        setFlash,
        setIsLoading,
        clearIsLoading
    } = useAppContext()

    const {
        token,
        setUserInStorage,
        setUserInContext,
        clearUser
    } = useUserContext()

    const navigate = useNavigate()

    const fetchData = async({
                                endpoint,
                                method='POST',
                                body={},
                                authorization='',
                                redirect,
                                flashContent
    }) => {
        try {
            const url = `${SERVER_URL}/${endpoint}`

            const response = await fetch(url,
                fetchOptions({ method, body, authorization }))

            const data = await response.json()

            if(response.status === StatusCodes.OK || response.status === StatusCodes.CREATED){
                const { user, token } = data

                setFlash({ message: flashContent })

                setTimeout(() => {
                    method === 'POST' && redirect()
                    setUserInStorage(user, token)
                    setUserInContext(user, token)
                }, 1500)

            } else if (response.status === StatusCodes.FORBIDDEN) {
                setFlash({ type: 'danger', message: 'Your session expired, please log in' })

                setTimeout(() => {
                    clearUser()
                    redirect()
                }, 1500)

            } else if(data && data.error) {
                // clearUser()
                setFlash({ type: 'danger', message: data.error.message })
            }
        } catch (error) {
            // clearUser()
            setFlash({ type: 'danger', message: error.message })
            console.log(error)
        }
    }

    // POST auth/register
    const createUser = async(name, email, password) => {
        setIsLoading()
        const endpoint = `auth/register`
        const body = JSON.stringify({ name, email, password })
        const redirect = () => navigate('/dashboard')
        const flashContent = `${email.split('@')[0]} registration was successful!`
        await fetchData({
            endpoint, body, redirect, flashContent
        })
        clearIsLoading()
    }

    // POST auth/login
    const getUser = async(email, password) => {
        setIsLoading()
        const endpoint = `auth/login`
        const body = JSON.stringify({ email, password })
        const redirect = () => navigate('/dashboard')
        const flashContent = `${email.split('@')[0]} logged in successfully!`
        await fetchData({
            endpoint, body, redirect, flashContent
        })
        clearIsLoading()
    }

    // PATCH auth/ authenticated user (token) is required
    const updateUser = async(updateUserObject) => {
        setIsLoading()
        // if(!token) return navigate('/')

        const endpoint = `auth`
        const method = 'PATCH'
        const body = JSON.stringify(updateUserObject)
        const authorization = `Bearer ${token}`
        const flashContent = `Updated successfully!`

        if(token) {
            await fetchData({
                endpoint, method, body, authorization, flashContent
            })
            clearIsLoading()
        } else {
            throw new Error('Please authenticate and try again')
        }
    }

    return {
        getUser,
        createUser,
        updateUser
    }
}

export default useFetchUserHook
