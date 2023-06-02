'use client'

import type { MutableRefObject } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import type { GeocodeResult } from 'use-places-autocomplete'
import type { color } from '@material-tailwind/react/types/components/button'

type LatLngLiteral = google.maps.LatLngLiteral
type MapOptions = google.maps.MapOptions
type GeocoderResult = google.maps.GeocoderResult

export namespace iCustomGoogleMap {
  export enum ZoomLevel {
    world = 1,
    continent = 5,
    city = 10,
    default = 13,
    street = 15,
    construction = 20,
  }

  export interface CustomMarker {
    position: LatLngLiteral
    icon?: string
    label?: string
    description?: string
    place_id?: string
    zoom?: ZoomLevel
    iconColor?: color
  }

  export interface ForwardedRef {
    possibleAddresses: MutableRefObject<GeocodeResult[] | undefined>
    mapRef: MutableRefObject<google.maps.Map | undefined>
    removeMarker: (removedMarker: CustomMarker) => void
    updateMarker: (oldMarker: CustomMarker, newMarker: CustomMarker) => void
    persistMarker: (newMarker: CustomMarker) => void
    setSelectedMarker: (newSelectedMarker: CustomMarker) => void
    getPersistedMarkers: () => CustomMarker[]
    getSelectedMarker: () => CustomMarker | undefined
    clearSelectedMarker: () => void
  }

  export type NewMarkerAction = 'add' | 'delete' | 'drag' | 'update'

  export interface props {
    onNewMarker?: (newMarker: CustomMarker | null, allMarkers: CustomMarker[], action: NewMarkerAction) => void
  }
}

// TODO: WIP
export function getGeocodeZoom(geocode?: GeocoderResult) {
  if (geocode?.types.includes('continent')) return iCustomGoogleMap.ZoomLevel.continent
  if (!geocode) return iCustomGoogleMap.ZoomLevel.default
  if (geocode.geometry.location_type === google.maps.GeocoderLocationType.ROOFTOP) return iCustomGoogleMap.ZoomLevel.street
  if (geocode.geometry.location_type === google.maps.GeocoderLocationType.RANGE_INTERPOLATED) return iCustomGoogleMap.ZoomLevel.street
  if (geocode.geometry.location_type === google.maps.GeocoderLocationType.APPROXIMATE) return iCustomGoogleMap.ZoomLevel.city
  if (geocode.geometry.location_type === google.maps.GeocoderLocationType.GEOMETRIC_CENTER) return iCustomGoogleMap.ZoomLevel.default
}

export default forwardRef<iCustomGoogleMap.ForwardedRef | undefined, iCustomGoogleMap.props>(function CustomGoogleMap({ onNewMarker }, ref) {
  const [selectedMarker, setSelectedMarker] = useState<iCustomGoogleMap.CustomMarker>()
  const [markers, setMarkers] = useState<iCustomGoogleMap.CustomMarker[]>([])
  const [center, setCenter] = useState<LatLngLiteral>()

  const Geocoder = useMemo<google.maps.Geocoder>(() => new google.maps.Geocoder(), [])
  const movingMarker = useRef<iCustomGoogleMap.CustomMarker>()
  const possibleAddresses = useRef<GeocodeResult[]>()
  const mapRef = useRef<google.maps.Map>()
  const options = useMemo<MapOptions>(
    () => ({
      mapId: 'b181cac70f27f5e6',
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  )

  useEffect(() => {
    // Sao Paulo - Brazil
    if (!navigator.geolocation) setCenter({ lat: -23.561723152766955, lng: -46.63545728606685 })

    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [])

  function removeMarker(removedMarker: iCustomGoogleMap.CustomMarker) {
    const newMarkers = markers.filter((e) => e.position.lat !== removedMarker.position.lat && e.position.lng !== removedMarker.position.lng)

    if (removedMarker.position.lat === selectedMarker?.position.lat && removedMarker.position.lng === selectedMarker?.position.lng) setSelectedMarker(undefined)
    if (onNewMarker) onNewMarker(null, newMarkers, 'delete')

    setMarkers(newMarkers)
  }

  function updateMarker(oldMarker: iCustomGoogleMap.CustomMarker, newMarker: iCustomGoogleMap.CustomMarker) {
    const newMarkers = markers.map((currentMarker) =>
      currentMarker.position.lat === oldMarker.position.lat && currentMarker.position.lng === oldMarker.position.lng ? newMarker : currentMarker
    )

    if (onNewMarker) onNewMarker(newMarker, newMarkers, 'update')
    setMarkers(newMarkers)
  }

  function generateMarker(newMarker: iCustomGoogleMap.CustomMarker) {
    // avoid <Marker /> duplicancy
    if (markers.find((e) => e.position.lat === newMarker.position.lat && e.position.lng === newMarker.position.lng)) return

    const newMarkers = [...markers, newMarker]

    if (onNewMarker) onNewMarker(newMarker, newMarkers, 'add')
    setMarkers(newMarkers)
  }

  function onLoad(map: google.maps.Map) {
    if (!map) return

    mapRef.current = map
  }

  async function handleMapClick(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return

    const newMarker = { position: event.latLng.toJSON() }

    setSelectedMarker(newMarker)

    const { results } = await Geocoder.geocode({ location: newMarker.position })
    possibleAddresses.current = results
  }

  function handleMarkerDragStart(event: google.maps.MapMouseEvent) {
    const position = event.latLng?.toJSON()

    if (position) movingMarker.current = markers.find((e) => e.position.lat === position.lat && e.position.lng === position.lng) ?? { position }
  }

  function handleMarkerDragEnd(event: google.maps.MapMouseEvent) {
    if (!event.latLng || !movingMarker.current) return
    updateMarker(movingMarker.current, { ...movingMarker.current, position: event.latLng.toJSON() })
    movingMarker.current = undefined
  }

  useImperativeHandle(ref, () => ({
    removeMarker,
    updateMarker,
    persistMarker: generateMarker,
    mapRef,
    possibleAddresses,
    getPersistedMarkers: () => markers,
    getSelectedMarker: () => selectedMarker,
    setSelectedMarker,
    clearSelectedMarker: () => setSelectedMarker(undefined),
  }))

  return (
    <GoogleMap
      onLoad={onLoad}
      onClick={handleMapClick}
      center={center}
      mapContainerClassName="h-full w-full"
      zoom={iCustomGoogleMap.ZoomLevel.default}
      options={options}
    >
      {selectedMarker && (
        <Marker
          visible={!!selectedMarker}
          key={`${selectedMarker.position.lng}${selectedMarker.position.lat}`}
          position={selectedMarker.position}
        />
      )}
      {markers.map((marker) => {
        return (
          <Marker
            key={`${marker.position.lng}${marker.position.lat}`}
            position={marker.position}
            onDragStart={handleMarkerDragStart}
            onDragEnd={handleMarkerDragEnd}
            icon={marker.icon}
            draggable
          />
        )
      })}
    </GoogleMap>
  )
})
