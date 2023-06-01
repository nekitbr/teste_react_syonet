// TODO: mudar para utilizar tailwindcss

import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox'
import '@reach/combobox/styles.css'
import type { iCustomGoogleMap } from './CustomGoogleMap'
import { getGeocodeZoom } from './CustomGoogleMap'
import { useEffect, useRef } from 'react'

interface PlacesProps {
  onSelect: (position: iCustomGoogleMap.CustomMarker) => void
}

export default function LocationSelect({ onSelect }: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete()

  const dataOptions = useRef<google.maps.places.AutocompletePrediction[]>([])

  useEffect(() => {
    if (status === 'OK') dataOptions.current = data
  }, [data])

  async function handleSelect(value: string) {
    const valueData = dataOptions.current.find((e) => e.description === value)
    setValue(value, false)
    clearSuggestions()

    const results = await getGeocode({ address: value })

    // latitude, longitude
    const { lat, lng } = getLatLng(results[0])

    onSelect({
      position: {
        lat,
        lng,
      },
      description: valueData?.structured_formatting.secondary_text,
      label: valueData?.structured_formatting.main_text,
      place_id: valueData?.place_id,
      zoom: getGeocodeZoom(results[0]),
    })
  }

  return (
    <Combobox
      className="mr-3"
      onSelect={handleSelect}
    >
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="text-black w-full p-2"
        placeholder="Search office address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' &&
            data.map((a) => {
              return (
                <ComboboxOption
                  key={a.place_id}
                  value={a.description}
                />
              )
            })}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}
