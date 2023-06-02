/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Map, { Marker, Popup } from 'react-map-gl'
import clsx from 'clsx'
import { useUserContext, useJobsContext } from '../../contextAPI/context'

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
const mapStyle = 'mapbox://styles/mapbox/streets-v9'

const ZOOMS = {
  LARGE_VIEW: 9,
  CLOSE_VIEW: 12,
}

const MapView = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  // * context
  const { user } = useUserContext()
  const {
    jobs,
    editJobId,
    popUpJobId,
    setIsEditModeInContext,
    setEditJobIdInContext,
    setPopUpJobIdInContext,
  } = useJobsContext()

  // * local state
  const mapRef = useRef(null)
  const [userMarkerLngLat, setUserMarkerLngLat] = useState({
    longitude: 14.44,
    latitude: 35.89,
  })
  const [jobsMarkersLngLat, setJobsMarkersLngLat] = useState([])
  const [jobPopUp, setJobPopUp] = useState(null)

  // * functions
  const flyTo = (lngLat, zoom = ZOOMS.LARGE_VIEW) => {
    mapRef.current?.flyTo({ center: lngLat, zoom })
  }

  // set user marker & fly to user location
  useEffect(() => {
    if (!user || user?.location?.coordinates?.length === 0) return

    const [longitude, latitude] = user.location.coordinates

    setUserMarkerLngLat({ longitude, latitude })

    flyTo([longitude, latitude])
  }, [user])

  // set jobs markers
  const getJobsMarkers = useCallback(() => {
    if (!jobs || jobs?.length <= 1) return

    const newMarkers = jobs
      .filter((job) => job._id !== '1')
      .filter((job) => job?.location?.coordinates?.length !== 0)
      .map((job) => {
        const [longitude, latitude] = job.location.coordinates
        return { jobId: job._id, longitude, latitude }
      })

    setJobsMarkersLngLat(newMarkers)
  }, [jobs])

  useEffect(() => {
    getJobsMarkers()
  }, [getJobsMarkers])

  // set jobPopUp & fly to job location
  useEffect(() => {
    if (!popUpJobId) return

    const job = jobs.find((job) => job._id === popUpJobId)
    if (!job || job?.location?.coordinates?.length === 0) return

    const {
      company,
      status,
      location: {
        coordinates: [longitude, latitude],
      },
    } = job

    setJobPopUp({
      jobId: popUpJobId,
      company,
      status,
      longitude,
      latitude,
    })

    flyTo([longitude, latitude], ZOOMS.CLOSE_VIEW)
  }, [jobs, popUpJobId])

  // fly to job location on edit job page & show job popUp
  useEffect(() => {
    if (!editJobId) return

    const job = jobs.find((job) => job._id === editJobId)
    if (!job || job?.location?.coordinates?.length === 0) return

    const [longitude, latitude] = job.location.coordinates

    flyTo([longitude, latitude], ZOOMS.CLOSE_VIEW)

    setPopUpJobIdInContext(editJobId)
  }, [jobs, editJobId, setPopUpJobIdInContext])

  // fly to user location on dashboard & profile pages
  useEffect(() => {
    if (path === '/dashboard' || path === '/dashboard/profile') {
      setPopUpJobIdInContext(null)

      const { longitude, latitude } = userMarkerLngLat

      flyTo([longitude, latitude])
    }
  }, [path, userMarkerLngLat, setPopUpJobIdInContext])

  // handle jobMarker click
  const handleJobMarkerClick = (jobId) => {
    if (!jobId) return
    setPopUpJobIdInContext(jobId)
  }

  // navigate to edit job page & fly to job location
  const handlePopUpEditButtonClick = (jobId) => {
    setEditJobIdInContext(jobId)
    setIsEditModeInContext(true)
    navigate('/dashboard/add-job')

    const job = jobs.find((job) => job._id === jobId)
    if (!job || job?.location?.coordinates?.length === 0) return

    const [longitude, latitude] = job.location.coordinates

    flyTo([longitude, latitude], ZOOMS.CLOSE_VIEW)
  }

  const handleClosePopup = () => {
    setPopUpJobIdInContext(null)
  }

  // * marker classes
  const jobMarkerClass = (jobId) => {
    return clsx('marker gray-marker', {
      'blue-marker': jobId === editJobId,
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
        zoom: ZOOMS.LARGE_VIEW,
      }}
      style={{ height: 400 }}
      mapStyle={mapStyle}
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={() => {
        getJobsMarkers()
      }}
    >
      <>
        {/* job popUp */}
        {popUpJobId && jobPopUp?.longitude && jobPopUp?.latitude && (
          <Popup
            anchor="bottom"
            longitude={Number(jobPopUp.longitude)}
            latitude={Number(jobPopUp.latitude)}
            offset={[0, -30]}
            onClose={handleClosePopup}
            className="rounded-circle"
          >
            <div className="mt-3">
              <span className={jobStatusPopupClass(jobPopUp.status)}>
                {jobPopUp.status}
              </span>
              <span className="d-block">{jobPopUp.company}</span>
              <button
                type="button"
                onClick={() => handlePopUpEditButtonClick(jobPopUp.jobId)}
                className="popup--edit-btn"
              >
                Edit
              </button>
            </div>
          </Popup>
        )}

        {/* userMarker */}
        {user && userMarkerLngLat && (
          <Marker
            longitude={userMarkerLngLat.longitude}
            latitude={userMarkerLngLat.latitude}
            anchor="bottom"
          >
            <div className="marker green-marker" />
          </Marker>
        )}

        {/* jobsMarkers */}
        {jobs &&
          jobsMarkersLngLat?.map((marker) => {
            const { jobId, longitude, latitude } = marker
            return jobId ? (
              <Marker
                key={jobId}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
              >
                <div
                  onClick={() => handleJobMarkerClick(jobId)}
                  className={jobMarkerClass(jobId)}
                />
              </Marker>
            ) : null
          })}
      </>
    </Map>
  )
}

export default MapView
