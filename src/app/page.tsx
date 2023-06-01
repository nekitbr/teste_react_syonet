'use client'

import type { iCustomGoogleMap } from '@/components/Map/CustomGoogleMap'
import CustomGoogleMap from '@/components/Map/CustomGoogleMap'
import LocationSelect from '@/components/Map/LocationSelect'
import MarkerList from '@/components/Map/MarkerList'
import Icon from '@/components/layout/Icon'
import Row from '@/components/layout/Row'
import { Collapse, Typography } from '../components/material-tailwind/components'
import { useLoadScript } from '@react-google-maps/api'
import { useRef, useState } from 'react'

// defining outside component to avoid useEffect re-render with loadScript
const libraries: ['places'] = ['places']

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const [selectedMarker, setSelectedMarker] = useState<iCustomGoogleMap.CustomMarker>()
  const mapRef = useRef<iCustomGoogleMap.ForwardedRef>()
  const [markers, setMarkers] = useState<iCustomGoogleMap.CustomMarker[]>([
    {
      position: {
        lat: 6.42375,
        lng: -66.58972,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58973,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58974,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58975,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58976,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58977,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58978,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58979,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58913,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58923,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58933,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58943,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58953,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
    {
      position: {
        lat: 6.42375,
        lng: -66.58963,
      },
      label: 'Venezuela',
      place_id: 'ChIJAdjLNstTKIwR003VfFjyoNw',
    },
  ])

  function handleHighlightMarker(marker: iCustomGoogleMap.CustomMarker) {
    setSelectedMarker(marker)
    mapRef.current?.setSelectedMarker(marker)
    mapRef.current?.mapRef.current?.panTo(marker.position)
    mapRef.current?.mapRef.current?.setZoom(marker.zoom as number)
  }

  function handleNewMarkers(
    newMarker: iCustomGoogleMap.CustomMarker | null,
    allMarkers: iCustomGoogleMap.CustomMarker[],
    action: iCustomGoogleMap.NewMarkerAction
  ) {
    setMarkers(allMarkers)

    if (action === 'delete' || !newMarker) return

    mapRef.current?.setSelectedMarker(newMarker)
    setMarkers(allMarkers)
  }

  function handleSaveMarker() {
    if (!mapRef.current) return

    const savedMarker = mapRef.current.getSelectedMarker()
    if (savedMarker) {
      mapRef.current?.persistMarker(savedMarker)
      mapRef.current?.clearSelectedMarker()
    }
  }

  if (isLoaded)
    return (
      <div className="max-h-screen text-white bg-blue-gray-900 flex">
        <div className="p-4 bg-blue-gray-800">
          <Typography
            className="mb-1"
            variant="h6"
          >
            Add new markers:
          </Typography>
          <Row className="mb-4">
            <LocationSelect onSelect={handleHighlightMarker} />
            <Icon
              button
              onClick={handleSaveMarker}
              variant="filled"
              iconName="add"
              size="md"
              color="blue-gray"
            />
          </Row>
          <div className="overflow-auto">
            <Collapse open={markers.length > 0}>
              <Typography
                className="mb-1"
                variant="h6"
              >
                Your Markers
              </Typography>
              <MarkerList
                selection
                selectedMarker={selectedMarker}
                onClickItem={handleHighlightMarker}
                onDelete={(a) => mapRef.current?.removeMarker(a)}
                items={markers}
              />
            </Collapse>
          </div>
        </div>
        <div className="h-screen w-screen">
          <CustomGoogleMap
            onNewMarker={handleNewMarkers}
            ref={mapRef}
          />
        </div>
      </div>
    )
}
