import Column from '../layout/Column'
import Divider from '../layout/Divider'
import Icon from '../layout/Icon'
import { IconButton, List, ListItem, ListItemPrefix, ListItemSuffix, Typography } from '../material-tailwind/components'

import type { iCustomGoogleMap } from './CustomGoogleMap'

interface MarkerListProps {
  items: iCustomGoogleMap.CustomMarker[]
  onClickIcon?: (arg1: iCustomGoogleMap.CustomMarker) => void
  onClickItem?: (arg1: iCustomGoogleMap.CustomMarker) => void
  onDelete?: (arg1: iCustomGoogleMap.CustomMarker) => void
  selectedMarker?: iCustomGoogleMap.CustomMarker
  className?: string
}

export default function MarkerList({ className, selectedMarker, onClickIcon, onClickItem, items, onDelete }: MarkerListProps = { items: [] }) {
  return (
    <List className={`${className ?? ''} bg-white border rounded mb-5`}>
      {items?.map((item, index, arr) => (
        <div key={item?.place_id ?? index}>
          <ListItem
            className="hover:bg-blue-gray-50/40"
            selected={selectedMarker?.position.lat === item?.position.lat && selectedMarker?.position.lng === item?.position.lng}
            onClick={(event) => {
              event.stopPropagation()
              if (onClickItem) onClickItem(item)
            }}
            onDoubleClick={(event) => {
              event.stopPropagation()
              if (onClickIcon) onClickIcon(item)
            }}
          >
            <ListItemPrefix>
              <IconButton
                variant="text"
                color={item?.iconColor ?? 'blue-gray'}
                onClick={(event) => {
                  event.stopPropagation()
                  if (onClickIcon) onClickIcon(item)
                }}
              >
                {typeof item?.icon === 'string' ? <img src={item?.icon} /> : <Icon iconName={item?.icon ?? 'location_on'} />}
              </IconButton>
            </ListItemPrefix>

            <Column>
              <Typography variant="lead">{item.label ?? ''}</Typography>
              <Typography variant="small">{item.description ?? ''}</Typography>
            </Column>

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
        </div>
      ))}
    </List>
  )
}
