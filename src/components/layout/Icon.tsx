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
}

/**
 * This component displays an icon from Google Material Icons (https://fonts.google.com/icons?icon.set=Material+Symbols)
 */
export default function Icon({ size, iconName }: IconProps) {
  return (
    <span
      style={{ fontSize: getSize(size) }}
      className={'self-center material-symbols-outlined'}
    >
      {iconName}
    </span>
  )
}
