import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { MouseEventHandler } from 'react'
import ButtonComponent from './button'

interface buttonSpecType {
  key: string
  text: string
  func: MouseEventHandler<HTMLButtonElement>
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  display: boolean
  disabled: boolean
}

interface buttonsType {
  buttonSpecs: buttonSpecType[]
}
export default function ButtonsComponent({ buttonSpecs }: buttonsType) {
  return (
    <>
      {buttonSpecs
        .filter((info: buttonSpecType) => info.display)
        .map(({ key, text, func, icon: Icon, display, disabled }) => (
          <ButtonComponent key={key} text={text} func={func} Icon={Icon} disabled={disabled} />
        ))}
    </>
  )
}
