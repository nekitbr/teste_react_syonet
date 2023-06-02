// TODO: mudar para utilizar tailwindcss

import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox'
import '@reach/combobox/styles.css'
import type { iCustomGoogleMap } from './CustomGoogleMap'
import { getGeocodeZoom } from './CustomGoogleMap'
import { useEffect, useMemo, useRef, useState } from 'react'

interface PlacesProps {
  onSelect: (position: iCustomGoogleMap.CustomMarker) => void
  mode: 'address' | 'ltnlng'
}

export default function LocationSelect({ mode, onSelect }: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions: _clearSuggestions,
  } = usePlacesAutocomplete()

  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const Geocoder = useMemo<google.maps.Geocoder>(() => new google.maps.Geocoder(), [])
  const dataOptions = useRef<google.maps.places.AutocompletePrediction[]>([])

  function clearSuggestions() {
    _clearSuggestions()
    setSuggestions([])
  }

  useEffect(() => {
    if (!data.length) return

    if (status === 'OK') {
      dataOptions.current = data
      setSuggestions(data)
    } else {
      clearSuggestions()
    }
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

  async function handleLatLngSearch(value: string) {
    try {
      const [lat, lng] = value.split(',').map((e) => Number(e))

      if (!lat || !lng || isNaN(lat) || isNaN(lng)) throw new Error('invalid code')

      const { results } = await Geocoder.geocode({ location: { lat, lng } })

      const result = results[0]

      dataOptions.current = [
        {
          description: result.formatted_address,
          matched_substrings: [],
          place_id: result.place_id,
          terms: [],
          structured_formatting: { main_text: result.formatted_address, secondary_text: '', main_text_matched_substrings: [] },
          types: [],
        },
      ]
      setSuggestions(dataOptions.current)
    } catch (e) {}
  }

  return (
    <Combobox
      className="mr-3"
      onSelect={handleSelect}
    >
      <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value, mode === 'address')
          if (mode === 'ltnlng') handleLatLngSearch(e.target.value)
        }}
        disabled={!ready}
        className="text-black w-full p-2"
        placeholder={`${mode === 'address' ? 'Search address' : '-27.398990, -53.467005'}`}
      />
      <ComboboxPopover>
        <ComboboxList>
          {suggestions.map((a) => {
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
