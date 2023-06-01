'use client'

import type { iCustomGoogleMap } from '@/components/Map/CustomGoogleMap'
import CustomGoogleMap from '@/components/Map/CustomGoogleMap'
import LocationSelect from '@/components/Map/LocationSelect'
import MarkerList from '@/components/Map/MarkerList'
import Icon from '@/components/layout/Icon'
import Row from '@/components/layout/Row'
import { Collapse, IconButton, Typography } from '../components/material-tailwind/components'
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
  const [markers, setMarkers] = useState<iCustomGoogleMap.CustomMarker[]>([])

  function handleHighlightMarker(marker: iCustomGoogleMap.CustomMarker) {
    setSelectedMarker(marker)
    mapRef.current?.setSelectedMarker(marker)
    mapRef.current?.mapRef.current?.panTo(marker.position)
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
      <div className="text-white bg-blue-gray-900 flex min-w-full h-full w-full min-h-full">
        <div className="w-1/4 p-4 bg-blue-gray-800">
          <h1>Add new markers:</h1>
          <Row>
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
          <div>
            <Collapse open={markers.length > 0}>
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
        <div className="w-3/4 min-h-full">
          <CustomGoogleMap
            onNewMarker={handleNewMarkers}
            ref={mapRef}
          />
        </div>
      </div>
    )
}
