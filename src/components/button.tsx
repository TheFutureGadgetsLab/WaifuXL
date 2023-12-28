import { Button, SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { MouseEventHandler } from 'react'

interface buttonTypes {
  item_key: string
  func: MouseEventHandler<HTMLButtonElement>
  disabled: boolean
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  text: string
}

export default function ButtonComponent({ item_key, func, disabled, Icon, text }: buttonTypes) {
  return (
    <Button
      key={item_key}
      onClick={func}
      disabled={disabled}
      variant="contained"
      size="large"
      sx={{
        justifyContent: 'flex-start',
        marginBottom: 2,
        ':not(:last-child)': {
          marginBottom: 1,
        },
        color: 'secondary.main',
      }}
      startIcon={<Icon />}
      color="primary"
    >
      {text}
    </Button>
  )
}
