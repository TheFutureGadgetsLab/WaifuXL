import { Button, SvgIconTypeMap, SxProps, Theme } from '@mui/material'

import { MouseEventHandler } from 'react'
import { OverridableComponent } from '@mui/material/OverridableComponent'

interface buttonTypes {
  item_key: string
  func: MouseEventHandler<HTMLButtonElement>
  disabled: boolean
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  text: string
  color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  sx?: SxProps<Theme> | undefined
}

export default function ButtonComponent({ item_key, func, disabled, Icon, text, sx, color }: buttonTypes) {
  return (
    <Button
      key={item_key}
      onClick={func}
      disabled={disabled}
      variant="contained"
      size="large"
      sx={sx}
      startIcon={<Icon />}
      color={color}
    >
      {text}
    </Button>
  )
}
