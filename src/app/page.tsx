'use client'

import type { iCustomGoogleMap } from '@/components/Map/CustomGoogleMap'
import CustomGoogleMap from '@/components/Map/CustomGoogleMap'
import LocationSelect from '@/components/Map/LocationSelect'
import MarkerList from '@/components/Map/MarkerList'
import Icon from '@/components/layout/Icon'
import Row from '@/components/layout/Row'
import Drawer from '@/components/layout/Drawer'
import { Collapse, IconButton, Tooltip, Typography } from '../components/material-tailwind/components'
import { useLoadScript } from '@react-google-maps/api'
import type { Dispatch, SetStateAction } from 'react'
import { useRef, useState } from 'react'
import EditMarkerModal from '@/components/Map/EditMarkerModal'
import Column from '@/components/layout/Column'
import { useSnackbar } from 'notistack'

// defining outside component to avoid useEffect re-render with loadScript
const libraries: ['places'] = ['places']

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
  const snackbar = useSnackbar()

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
        <EditMarkerModal
          editMarker={editMarker as iCustomGoogleMap.CustomMarker}
          setEditMarker={setEditMarker as Dispatch<SetStateAction<iCustomGoogleMap.CustomMarker>>}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onYes={(editMarker) => mapRef.current?.updateMarker(editMarker, editMarker)}
        />

        <div className="max-h-screen text-white bg-blue-gray-900 flex">
          <Drawer<iCustomGoogleMap.CustomMarker>
            onClickIconItem={(marker) => handleHighlightMarker(marker, true)}
            items={markers}
            defaultIcon={<Icon iconName={'location_on'} />}
          >
            <>
              <Column className="w-full">
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
              </Column>
              {markers.length > 0 && (
                <Collapse open={markers.length > 0}>
                  <Typography
                    className="mt-2 mb-1"
                    variant="h6"
                  >
                    Your Markers
                  </Typography>
                  <MarkerList
                    className="max-h-[75vh] overflow-auto"
                    selectedMarker={selectedMarker}
                    onClickIcon={(marker) => handleModal(true, marker)}
                    onClickItem={(marker) => handleHighlightMarker(marker, true)}
                    onDelete={(a) => {
                      snackbar.enqueueSnackbar('Deleted!', { variant: 'info' })
                      mapRef.current?.removeMarker(a)
                    }}
                    items={markers}
                  />
                </Collapse>
              )}
            </>
          </Drawer>
          <div className="h-screen w-full">
            <CustomGoogleMap
              onNewMarker={handleNewMarkers}
              ref={mapRef}
            />
          </div>
        </div>
      </>
    )
}
