'use client'

import type { iCustomGoogleMap } from '@/components/Map/CustomGoogleMap'
import CustomGoogleMap from '@/components/Map/CustomGoogleMap'
import LocationSelect from '@/components/Map/LocationSelect'
import MarkerList from '@/components/Map/MarkerList'
import Icon from '@/components/layout/Icon'
import Row from '@/components/layout/Row'
import { Collapse, IconButton, Input, Tooltip, Typography } from '../components/material-tailwind/components'
import { useLoadScript } from '@react-google-maps/api'
import { useRef, useState } from 'react'
import Modal from '@/components/layout/Modal'
import Divider from '@/components/layout/Divider'
import type { color } from '@material-tailwind/react/types/components/button'
import Image from 'next/image'
import Column from '@/components/layout/Column'

// defining outside component to avoid useEffect re-render with loadScript
const libraries: ['places'] = ['places']
const colorsScheme: color[] = ['gray', 'blue-gray', 'red', 'orange', 'amber', 'green', 'blue', 'indigo', 'purple']
const defaultIconsUrl: string[] = [
  'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  'http://maps.google.com/mapfiles/ms/icons/homegardenbusiness.png',
  'http://maps.google.com/mapfiles/ms/icons/hospitals.png',
  'http://maps.google.com/mapfiles/ms/icons/motorcycling.png',
  'http://maps.google.com/mapfiles/ms/icons/plane.png',
  'http://maps.google.com/mapfiles/ms/icons/restaurant.png',
  'http://maps.google.com/mapfiles/ms/icons/arts.png',
  'http://maps.google.com/mapfiles/ms/icons/wheel_chair_accessible.png',
  'http://maps.google.com/mapfiles/ms/icons/shopping.png',
]

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const [openModal, setOpenModal] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<iCustomGoogleMap.CustomMarker>()
  const [markers, setMarkers] = useState<iCustomGoogleMap.CustomMarker[]>([])
  const [useLtnLgn, setUseLtnLgn] = useState(false)
  const [editMarker, setEditMarker] = useState<iCustomGoogleMap.CustomMarker>()

  const mapRef = useRef<iCustomGoogleMap.ForwardedRef>()

  function handleHighlightMarker(marker: iCustomGoogleMap.CustomMarker, existing?: boolean) {
    setSelectedMarker(marker)

    if (existing) mapRef.current?.clearSelectedMarker()
    else mapRef.current?.setSelectedMarker(marker)

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

    if (action === 'add') mapRef.current?.setSelectedMarker(newMarker)
  }

  function handleSaveMarker() {
    if (!mapRef.current) return

    const savedMarker = mapRef.current.getSelectedMarker()
    if (savedMarker) {
      mapRef.current?.persistMarker(savedMarker)
      mapRef.current?.clearSelectedMarker()
    }
  }

  function handleModal(open: boolean, marker?: iCustomGoogleMap.CustomMarker) {
    if (marker) setEditMarker(marker)
    setOpenModal(!openModal)
  }

  if (isLoaded)
    return (
      <>
        <Modal
          handleOpen={(open) => handleModal(open)}
          open={openModal}
          onYes={() => {
            if (!editMarker?.place_id) return
            mapRef.current?.updateMarker(editMarker, editMarker)
          }}
          onNo={() => {
            handleModal(false)
          }}
          title={
            <Row>
              <span>Customize your marker! 🪄</span>
              <Column className="gap-3">
                <Input
                  label="Title"
                  className="self-center"
                  value={editMarker?.label}
                  onChange={(event) => {
                    event.stopPropagation()
                    if (!editMarker) return
                    setEditMarker({ ...editMarker, label: event.target.value })
                  }}
                  icon={<Icon iconName="edit" />}
                />
                <Input
                  label="Description"
                  className="self-center"
                  value={editMarker?.description}
                  onChange={(event) => {
                    event.stopPropagation()
                    if (!editMarker) return
                    setEditMarker({ ...editMarker, description: event.target.value })
                  }}
                  icon={<Icon iconName="edit" />}
                />
              </Column>
            </Row>
          }
        >
          <>
            <div className="mb-8">
              <Typography variant="h6">Pin Color</Typography>
              <Row className="mt-2 justify-evenly">
                {colorsScheme.map((color, index) => (
                  <IconButton
                    key={color}
                    className={editMarker?.iconColor === color || (!editMarker?.iconColor && index === 0) ? 'border border-black' : ''}
                    color={color}
                    children=""
                    onClick={() => {
                      if (!editMarker) return
                      setEditMarker({
                        ...editMarker,
                        iconColor: color,
                      })
                    }}
                  />
                ))}
              </Row>
            </div>
            <div>
              <Typography variant="h6">Map Icon</Typography>
              <Row className="mt-2 justify-evenly">
                {defaultIconsUrl.map((iconUrl, index) => (
                  <IconButton
                    key={iconUrl}
                    className={editMarker?.icon === iconUrl || (!editMarker?.icon && index === 0) ? 'border border-black' : ''}
                    onClick={() => {
                      if (!editMarker) return
                      setEditMarker({
                        ...editMarker,
                        icon: iconUrl === defaultIconsUrl[0] ? undefined : iconUrl,
                      })
                    }}
                  >
                    <img
                      src={iconUrl}
                      alt="icon"
                    />
                  </IconButton>
                ))}
              </Row>
            </div>
          </>
        </Modal>
        <div className="max-h-screen text-white bg-blue-gray-900 flex">
          <div className="p-4 bg-blue-gray-800">
            <div>
              <Row className="mb-1">
                <Tooltip
                  content={
                    <div>
                      <span>Currently: {useLtnLgn ? 'Latitude/Longitude' : 'Address'} mode</span>
                      <br />
                      <span>{useLtnLgn ? 'Change to Address mode' : 'Change to Latitute/Longitude mode'}</span>
                    </div>
                  }
                  placement="right"
                >
                  <IconButton
                    className="rounded mr-4"
                    onClick={() => setUseLtnLgn(!useLtnLgn)}
                    variant="filled"
                    color="blue-gray"
                  >
                    <Icon
                      iconName={useLtnLgn ? 'architecture' : 'gps_fixed'}
                      size="md"
                    />
                  </IconButton>
                </Tooltip>
                <Typography
                  className="mb-1"
                  variant="h6"
                >
                  Add new markers:
                </Typography>
              </Row>
              <Row>
                <LocationSelect
                  mode={useLtnLgn ? 'ltnlng' : 'address'}
                  onSelect={handleHighlightMarker}
                />
                <IconButton
                  className="p-2 rounded"
                  onClick={handleSaveMarker}
                  variant="filled"
                  color="blue-gray"
                >
                  <Icon
                    iconName="add"
                    size="md"
                  />
                </IconButton>
              </Row>
            </div>
            <Collapse open={markers.length > 0}>
              <Typography
                className="mt-2 mb-1"
                variant="h6"
              >
                Your Markers
              </Typography>
              <MarkerList
                className="max-h-[80vh] overflow-auto"
                selectedMarker={selectedMarker}
                onClickIcon={(marker) => handleModal(true, marker)}
                onClickItem={(marker) => handleHighlightMarker(marker, true)}
                onDelete={(a) => mapRef.current?.removeMarker(a)}
                items={markers}
              />
            </Collapse>
          </div>
          <div className="h-screen w-screen">
            <CustomGoogleMap
              onNewMarker={handleNewMarkers}
              ref={mapRef}
            />
          </div>
        </div>
      </>
    )
}
