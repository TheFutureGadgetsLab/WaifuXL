import { Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { MouseEventHandler, ReactNode } from 'react'
import ButtonComponent from './button'

interface inputSpecType {
  key: string
  text: string
  func: MouseEventHandler<HTMLButtonElement> | ((event: SelectChangeEvent<any>, child: ReactNode) => void) | undefined
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  display: boolean
  disabled: boolean
  type: string
  current: any
}

interface inputsType {
  buttonSpecs: inputSpecType[]
}
export default function InputsComponent({ buttonSpecs }: inputsType) {
  const toReturn = buttonSpecs
    .filter((info: inputSpecType) => info.display)
    .map(({ key, text, func, icon: Icon, display, disabled, type, current }) => {
      if (type == 'button') {
        return (
          <ButtonComponent
            key={(Math.random() + 1).toString(36).substring(7)}
            item_key={key}
            text={text}
            func={func as MouseEventHandler<HTMLButtonElement>}
            Icon={Icon}
            disabled={disabled}
          />
        )
      } else if (type == 'selection') {
        return (
          <FormControl key={key} fullWidth>
            <InputLabel>Factor</InputLabel>
            <Select
              value={current}
              color="primary"
              label={text}
              onChange={func as (event: SelectChangeEvent<any>, child: ReactNode) => void}
            >
              <MenuItem value={1}>2</MenuItem>
              <MenuItem value={2}>4</MenuItem>
              <MenuItem value={4}>8</MenuItem>
            </Select>
          </FormControl>
        )
      }
    })
  return <>{toReturn}</>
}
