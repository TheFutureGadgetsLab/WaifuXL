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

export const LOADING_TEXT_INTERVAL = 750

export const HEADER_LINKS = [
  { text: 'About', href: '/about', weight: 450, color: 'text.primary' },
  { text: 'WaifuXL', href: '/', weight: 600, color: 'secondary.main' },
  { text: 'Donate', href: '/donate', weight: 450, color: 'text.primary' },
] as const

export const MODAL_CONFIG = {
  maxWidth: 400,
  imageHeight: '24rem',
} as const

export const LAYOUT = {
  contentHeight: '90vh',
  sidebarBreakpoint: 'md',
  maxImageWidth: '80%',
} as const

export const ANIMATION = {
  loadingTextInterval: LOADING_TEXT_INTERVAL,
} as const
