import { Button, IconButton } from '@material-tailwind/react'
import type { variant, color } from '@material-tailwind/react/types/components/button'
import type { ReactElement } from 'react'

function getSize(size: IconProps['size']) {
  switch (size) {
    case 'xs':
      return 16
    case 'sm':
      return 24
    case 'md':
      return 32
    case 'lg':
      return 40
    case 'xl':
      return 56
    case 'xxl':
      return 112
    default:
      return 24
  }
}

interface IconProps {
  iconName: string
  size?: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl'
  button?: boolean
  children?: ReactElement | string
  onClick?: () => void
  variant?: variant
  color?: color
}

/**
 * This component displays an icon from Google Material Icons (https://fonts.google.com/icons?icon.set=Material+Symbols)
 */
export default function Icon({ color, children, size, iconName, onClick, variant, button }: IconProps) {
  if (!button)
    return (
      <span
        style={{ fontSize: getSize(size) }}
        className={'self-center material-symbols-outlined'}
      >
        {iconName}
      </span>
    )

  return (
    <div className="self-center">
      <IconButton
        className="flex items-center gap-3 rounded"
        onClick={onClick}
        variant={variant}
        color={color}
      >
        <span
          style={{ fontSize: getSize(size) }}
          className={'text-white align-bottom material-symbols-outlined'}
        >
          {iconName}
        </span>
        <span>{children}</span>
      </IconButton>
    </div>
  )
}
