import { PaletteColorOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    donation: Palette['primary']
  }

  interface PaletteOptions {
    donation?: PaletteColorOptions
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    donation: true
  }
}
