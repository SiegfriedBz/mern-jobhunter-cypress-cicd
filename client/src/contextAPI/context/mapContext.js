import { createContext, useContext, useReducer } from 'react'
import { mapReducer } from '../reducers'
import {
    SET_SHOW_POPUP,
    SET_POPUP
} from '../actions'

export const initialMapState = {
    showPopUp: false,
    popUpInfo: {
        jobId: null,
        company: '',
        status: 'pending'
    },
    popUpCoordinates: {
        longitude: 0,
        latitude: 0
    }
}

export const MapContext = createContext(null)

export const useMapContext = () => {
    return useContext(MapContext)
}

export const MapContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(mapReducer, initialMapState)

    const setJobPopupInContext = (job) => {
        const [jobLng, jobLat] = job?.location?.coordinates

        if(!jobLng || !jobLat) return

        setShowPopUpInContext()
        setPopUpInContext({
            popUpInfo: {
                jobId: job._id,
                company: job.company,
                status: job.status
            },
            popUpCoordinates: {
                longitude: jobLng,
                latitude: jobLat
            }
        })
    }

    const setShowPopUpInContext = (value=true) => {
        dispatch({
            type: SET_SHOW_POPUP,
            payload: value
        })
    }

    const setPopUpInContext = (popUpData= initialMapState ) => {
        dispatch({
            type: SET_POPUP,
            payload: popUpData
        })
    }

    return (
        <MapContext.Provider value={{
            ...state,
            setJobPopupInContext,
            setShowPopUpInContext,
        }}>
            { children }
        </MapContext.Provider>
    )
}
