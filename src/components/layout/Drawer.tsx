import Icon from '@/components/layout/Icon'
import { IconButton } from '../../components/material-tailwind/components'
import type { ReactElement } from 'react'
import { useState } from 'react'
import type { color } from '@material-tailwind/react/types/components/button'
import Column from './Column'

interface TestingProps<T> {
  children: ReactElement
  items: {
    icon?: ReactElement | string
    iconColor?: color
  }[]
  defaultIcon: ReactElement
  onClickIconItem: (arg1: T) => void
}

export default function Drawer<T>({ children, items: iconItems, defaultIcon, onClickIconItem }: TestingProps<T>) {
  const [open, setOpen] = useState(true)
  return (
    <div className={`bg-blue-gray-900 min-h-screen ${open ? 'lg:w-1/4 md:w-2/4 sm:w-11/12 w-11/12' : 'w-16'} duration-500 text-gray-100 px-4`}>
      <div className="pt-3 pb- flex justify-end">
        <IconButton
          variant="text"
          onClick={() => setOpen(!open)}
        >
          <Icon iconName="menu" />
        </IconButton>
      </div>
      <Column className="mt-2 items-center">
        {open ? (
          children
        ) : iconItems ? (
          iconItems.map((item, index) => {
            if (!item.icon)
              return (
                <IconButton
                  key={index}
                  variant="text"
                  color={item.iconColor}
                  onClick={() => onClickIconItem(item as T)}
                >
                  {defaultIcon}
                </IconButton>
              )
            if (typeof item.icon === 'string')
              return (
                <IconButton
                  key={index}
                  variant="text"
                  onClick={() => onClickIconItem(item as T)}
                >
                  <img src={item.icon} />
                </IconButton>
              )
            return (
              <IconButton
                key={index}
                variant="text"
                color={item.iconColor}
                onClick={() => onClickIconItem(item as T)}
              >
                {item.icon}
              </IconButton>
            )
          })
        ) : (
          <></>
        )}
      </Column>
    </div>
  )
}
