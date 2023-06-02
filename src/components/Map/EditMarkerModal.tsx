import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import Modal from '../layout/Modal'
import type { iCustomGoogleMap } from './CustomGoogleMap'
import Row from '../layout/Row'
import Column from '../layout/Column'
import { IconButton, Input, Typography } from '../material-tailwind/components'
import Icon from '../layout/Icon'
import type { color } from '@material-tailwind/react/types/components/button'
import { useSnackbar } from 'notistack'

interface EditMarkerModalProps {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  onYes: (arg1: iCustomGoogleMap.CustomMarker) => void
  editMarker: iCustomGoogleMap.CustomMarker
  setEditMarker: Dispatch<SetStateAction<iCustomGoogleMap.CustomMarker>>
}

export default function EditMarkerModal({ editMarker, setEditMarker, onYes, openModal, setOpenModal }: EditMarkerModalProps) {
  const colorsScheme = useMemo<color[]>(() => ['gray', 'blue-gray', 'red', 'orange', 'amber', 'green', 'blue', 'indigo', 'purple'], [])
  const defaultIconsUrl = useMemo(
    () => [
      'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'http://maps.google.com/mapfiles/ms/icons/homegardenbusiness.png',
      'http://maps.google.com/mapfiles/ms/icons/hospitals.png',
      'http://maps.google.com/mapfiles/ms/icons/motorcycling.png',
      'http://maps.google.com/mapfiles/ms/icons/plane.png',
      'http://maps.google.com/mapfiles/ms/icons/restaurant.png',
      'http://maps.google.com/mapfiles/ms/icons/arts.png',
      'http://maps.google.com/mapfiles/ms/icons/wheel_chair_accessible.png',
      'http://maps.google.com/mapfiles/ms/icons/shopping.png',
    ],
    []
  )

  function handleModal(open: boolean, marker?: iCustomGoogleMap.CustomMarker) {
    if (marker) setEditMarker(marker)
    setOpenModal(!openModal)
  }

  const snackbar = useSnackbar()

  return (
    <Modal
      className="w-full md:w-3/4"
      handleOpen={(open) => handleModal(open)}
      open={openModal}
      onYes={() => {
        if (!editMarker?.place_id) return
        onYes(editMarker)
        snackbar.enqueueSnackbar('Saved!', { variant: 'success' })
      }}
      onNo={() => {
        handleModal(false)
      }}
      title={
        <div className="flex flex-col md:flex-row md:text-start text-center w-full justify-evenly">
          <span className="mr-1 self-center">Customize your marker! 🪄</span>
          <Column className="md:w-3/4 gap-3">
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
        </div>
      }
    >
      <>
        <div className="mb-1 md:mb-8">
          <Typography variant="h6">Pin Color</Typography>
          <div className="md:flex md:flex-row mt-2 justify-evenly grid grid-cols-4 grid-rows-3 gap-x-3 gap-y-3">
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
          </div>
        </div>
        <div>
          <Typography variant="h6">Map Icon</Typography>
          <div className="md:flex md:flex-row mt-2 justify-evenly grid grid-cols-4 grid-rows-3 gap-x-3 gap-y-3">
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
          </div>
        </div>
      </>
    </Modal>
  )
}
