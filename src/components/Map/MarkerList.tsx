import Divider from '../layout/Divider'
import Icon from '../layout/Icon'
import { Collapse, IconButton, List, ListItem, ListItemPrefix, ListItemSuffix, Typography } from '../material-tailwind/components'

import type { iCustomGoogleMap } from './CustomGoogleMap'

interface MarkerListProps {
  items: iCustomGoogleMap.CustomMarker[]
  onDelete?: (arg1: iCustomGoogleMap.CustomMarker) => void
  onClickItem?: (arg1: iCustomGoogleMap.CustomMarker) => void
  selection?: boolean
  selectedMarker?: iCustomGoogleMap.CustomMarker
}

export default function MarkerList({ selectedMarker, onClickItem, selection, items, onDelete }: MarkerListProps = { items: [] }) {
  return (
    <div>
      <Collapse open>
        <List className="bg-white border rounded">
          {items?.map((item, index, arr) => (
            <>
              <ListItem
                key={index}
                className="hover:bg-blue-gray-50/40"
                selected={selectedMarker?.position.lat === item?.position.lat && selectedMarker?.position.lng === item?.position.lng}
                onClick={() => {
                  if (onClickItem) onClickItem(item)
                }}
              >
                <ListItemPrefix>
                  <Icon iconName={item?.icon ?? 'location_on'} />
                </ListItemPrefix>

                {/* TODO: double click libera edição de texto, enter salva o texto, emit pro elemento, update no mapa. */}
                {item.label}

                {onDelete ? (
                  <ListItemSuffix>
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation()
                        onDelete(item)
                      }}
                      variant="text"
                      color="blue-gray"
                    >
                      <Icon iconName="delete" />
                    </IconButton>
                  </ListItemSuffix>
                ) : null}
              </ListItem>
              {index + 1 < arr.length && <Divider />}
            </>
          ))}
        </List>
      </Collapse>
    </div>
  )
}
