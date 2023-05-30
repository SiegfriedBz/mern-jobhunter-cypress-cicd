import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    useUserContext,
    useJobsContext,
    useMapContext
} from "../../contextAPI/context"
import Map, { Marker, Popup } from 'react-map-gl'
import clsx from 'clsx'

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
const mapStyle = 'mapbox://styles/mapbox/streets-v9'

const ZOOMS = {
    LARGE_VIEW: 9,
    CLOSE_VIEW: 12
}

const MapView = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname

    // * context
    const { user } = useUserContext()
    const { jobs, editJobId, setIsEditModeInContext, setEditJobIdInContext } = useJobsContext()
    const {
        showPopUp,
        popUpInfo,
        popUpCoordinates,
        setJobPopupInContext, // set popUpInfo + popUpCoordinates
        setShowPopUpInContext // set showPopUp
    } = useMapContext()

    // * local state
    const mapRef = useRef(null)
    const [userMarkerLngLat, setUserMarkerLngLat] = useState({longitude: 14.44, latitude: 35.89 })
    const [jobsMarkersLngLat, setJobsMarkersLngLat] = useState([])
    const [popUp, setPopUp] = useState(null)

    // * functions
    // set user marker & fly to user location
    useEffect(() => {
        if (!user || user?.location?.coordinates?.length === 0) return

        const [longitude, latitude] = user.location.coordinates
        setUserMarkerLngLat({ longitude, latitude })

        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: ZOOMS.LARGE_VIEW })
    }, [user, mapRef.current])

    // set jobs markers
    const getJobsMarkers = useCallback(() => {
        if(!jobs || jobs?.length <= 1) return

        console.log('getJobsMarkers')
        const newMarkers = jobs
          .filter(job => job._id !== "1")
          .filter(job => job?.location?.coordinates?.length !== 0)
          .map(job => {
              const [longitude, latitude] = job.location.coordinates
              return { jobId: job._id, longitude, latitude }
          })

        setJobsMarkersLngLat(newMarkers)
    }, [jobs])

    useEffect(() => {
        getJobsMarkers()
    }, [getJobsMarkers])

    // fly to job location on edit job page
    useEffect(() => {
        if(!editJobId) return

        const job = jobs.find(job => job._id === editJobId)
        if (!job || job?.location?.coordinates?.length === 0) return

        const [longitude, latitude] = job.location.coordinates

        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: ZOOMS.CLOSE_VIEW })
    }, [editJobId])

    // fly to user location on dashboard & profile pages
    useEffect(() => {
        if(path === '/dashboard' || path === '/dashboard/profile') {
            handlePopUpClose()
            mapRef.current?.flyTo({ center: user.location.coordinates, zoom: ZOOMS.LARGE_VIEW })
        }
    }, [path])

    const handleJobMarkerClick = (jobId) => {
        const job = jobs.find(job => job._id === jobId)

        // set job edit mode + editJobId
        setEditJobIdInContext(jobId)
        setIsEditModeInContext(true)

        // set job popup + showPopUp
        setJobPopupInContext(job)
        setShowPopUpInContext(true)

        // const [longitude, latitude] = job?.location?.coordinates
        // if(!longitude || !latitude) return

        // mapRef.current?.flyTo({ center: [longitude, latitude], zoom: ZOOMS.CLOSE_VIEW })
    }

    const handlePopUpEditButtonClick = (jobId) => {
        // set job edit mode + editJobId
        setEditJobIdInContext(jobId)
        setIsEditModeInContext(true)

        // Close popup
        setShowPopUpInContext(false)

        // navigate to edit job
        navigate('/dashboard/add-job')
    }

    const handlePopUpClose = () => {
        setShowPopUpInContext(false)
    }

    // * marker classes
    const jobMarkerClass = (jobId) => {
        return clsx('marker gray-marker', {
            'blue-marker': jobId === editJobId
        })
    }

    // * popup classes
    const jobStatusPopupClass = (jobStatus) => {
        return clsx('badge d-block p-2 mb-2', {
            'text-bg-success': jobStatus === 'offer received',
            'text-bg-primary': jobStatus === 'interview',
            'text-bg-secondary': jobStatus === 'declined',
            'text-bg-info': jobStatus === 'pending',
        })
    }

    return (
            <Map
                ref={mapRef}
                initialViewState={{
                    ...userMarkerLngLat,
                    zoom: ZOOMS.LARGE_VIEW
                }}
                style={{height: 400}}
                mapStyle={mapStyle}
                mapboxAccessToken={MAPBOX_TOKEN}
                onMove={() => { getJobsMarkers() }}
            >
                <>
                    {/*job popUp*/}
                    {showPopUp && popUpCoordinates && popUpInfo &&
                        <Popup
                            anchor='bottom'
                            longitude={Number(popUpCoordinates.longitude)}
                            latitude={Number(popUpCoordinates.latitude)}
                            offset={[0, -30]}
                            onClose={handlePopUpClose}
                            className='rounded-circle'
                        >
                            <div className="mt-3">
                                <span className={jobStatusPopupClass(popUpInfo.status)}>{popUpInfo.status}</span>
                                <span className='d-block'>{popUpInfo.company}</span>
                                <button
                                    onClick={() => handlePopUpEditButtonClick(popUpInfo.jobId)}
                                    className='popup--edit-btn'
                                >
                                    Edit
                                </button>
                            </div>
                        </Popup>
                    }

                    {/*userMarker*/}
                    {user && userMarkerLngLat &&
                        <Marker longitude={userMarkerLngLat.longitude} latitude={userMarkerLngLat.latitude} anchor="bottom">
                            <div className="marker green-marker"></div>
                        </Marker>
                    }

                    {/*jobsMarkers*/}
                    {jobs && jobsMarkersLngLat?.map(marker => {
                        const { jobId, longitude, latitude } = marker
                        return jobId ?
                            <Marker key={jobId} longitude={longitude} latitude={latitude} anchor="bottom" >
                                <div
                                    onClick={() => handleJobMarkerClick(jobId)}
                                    className={jobMarkerClass(jobId)}
                                ></div>
                            </Marker>
                            : null
                    })}
                </>
            </Map>
    )
}

export default MapView
