export const PRESET_IMAGES = [
  { name: 'Ozen', url: 'https://i.imgur.com/Sf6sfPj.png' },
  { name: 'Senjougahara', url: 'https://i.imgur.com/cMX8YcK.jpg' },
  { name: 'Moomin', url: 'https://i.imgur.com/9I91yMq.png' },
  { name: 'Megumin', url: 'https://i.imgur.com/BKBt6bC.png' },
  { name: 'Aqua', url: 'https://i.imgur.com/yhIwVjZ.jpeg' },
  { name: 'Natsumi', url: 'https://i.imgur.com/yIIl7Z1.png' },
] as const

export const UPSCALE_FACTORS = [2, 4, 8] as const

export const TAGS_PER_PAGE = 7

export const HEADER_LINKS = [
  { text: 'About', href: '/about', weight: 450, color: 'text.primary' },
  { text: 'WaifuXL', href: '/', weight: 600, color: 'secondary.main' },
  { text: 'Donate', href: '/donate', weight: 450, color: 'text.primary' },
] as const

export const UI_CONFIG = {
  truncateStringLength: 25,
  circularProgressSize: 24,
  captionFontSize: '0.6rem',
  loadingTextInterval: 750,
  modal: {
    maxWidth: 400,
    imageHeight: '24rem',
    borderWidth: '2px',
    iconSize: 48,
    spacing: 2,
    minButtonWidth: 120,
  },
  layout: {
    contentHeight: '90vh',
    sidebarBreakpoint: 'md',
    maxImageWidth: '80%',
  },
} as const

export const STYLES = {
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  absolutePosition: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
  },
  borderDashed: {
    border: '2px dashed',
    borderColor: 'primary.main',
    borderRadius: 2,
  },
} as const
