// Theme colors - centralized for consistency
export const THEME_COLORS = {
  primary: '#FF869C',
  secondary: '#FFFFFF',
  success: '#44ABBC',
  alertInfo: '#60a5fa',
  donationButton: '#FF5F5F',
  donationButtonHover: '#FF4444',
} as const

// External links and brand info
export const EXTERNAL_LINKS = {
  github: 'https://github.com/TheFutureGadgetsLab',
  kofi: 'https://ko-fi.com/thefuturegadgetslab',
  kofiHandle: 'thefuturegadgetslab',
  kofiWidgetScript: 'https://storage.ko-fi.com/cdn/widget/Widget_2.js',
  blog: 'https://haydn.fgl.dev/posts/the-launch-of-waifuxl/',
  technical: {
    realEsrgan: 'https://arxiv.org/abs/2107.10833',
    mobilenetv3: 'https://arxiv.org/abs/1905.02244',
    onnxRuntime: 'https://onnxruntime.ai/',
    react: 'https://reactjs.org/',
    nextjs: 'https://nextjs.org/',
    materialUi: 'https://mui.com/',
  },
} as const

// Background assets
export const ASSETS = {
  mobileBg: '/MobileBG.svg',
  desktopBg: '/DesktopBG.svg',
} as const

// Grid column templates shared across layout components
export const GRID_COLUMNS = {
  mobile: '1fr',
  tablet: '280px 1fr',
  desktop: '320px 1fr 300px',
  largeDesktop: '320px 1fr 400px',
} as const

// Common responsive values used across components
export const RESPONSIVE = {
  headingFontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
  bodyFontSize: { xs: '1rem', sm: '1.1rem' },
  sectionPadding: { xs: 2, sm: 3 },
  pageGridColumns: {
    xs: GRID_COLUMNS.mobile,
    md: GRID_COLUMNS.tablet,
    lg: GRID_COLUMNS.desktop,
    xl: GRID_COLUMNS.largeDesktop,
  },
} as const

export const PRESET_IMAGES = [
  { name: 'Ozen', url: 'https://i.imgur.com/Sf6sfPj.png' },
  { name: 'Senjougahara', url: 'https://i.imgur.com/cMX8YcK.jpg' },
  { name: 'Moomin', url: 'https://i.imgur.com/9I91yMq.png' },
  { name: 'Megumin', url: 'https://i.imgur.com/BKBt6bC.png' },
  { name: 'Aqua', url: 'https://i.imgur.com/yhIwVjZ.jpeg' },
  { name: 'Natsumi', url: 'https://i.imgur.com/yIIl7Z1.png' },
] as const

export const UPSCALE_FACTORS = [2, 4, 8] as const

export const INFERENCE_CONFIG = {
  CHUNK_SIZE: 256,
  PAD_SIZE: 32,
  TAG_INDICES: {
    DESCRIPTORS_START: 0,
    DESCRIPTORS_END: 2000,
    CHARACTERS_START: 2000,
    CHARACTERS_END: 4000,
    RATINGS_START: 4000,
    RATINGS_END: 4003,
  },
} as const

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
    maxWidth: { xs: '95vw', sm: 500, md: 600 },
    imageHeight: { xs: '40vh', sm: '24rem', md: '28rem' },
    borderWidth: '2px',
    iconSize: { xs: 36, sm: 48 },
    spacing: 2,
    minButtonWidth: { xs: 100, sm: 120 },
  },
  layout: {
    appBarHeight: { xs: 64, sm: 70 },
    sidebarBreakpoint: 'md' as const,
    sidebarWidth: { md: 280, lg: 320 },
    maxImageWidth: { xs: '95%', sm: '85%', md: '75%', lg: '70%' },
    drawerWidth: 280,
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
  borderDashedResponsive: {
    border: '2px dashed',
    borderColor: 'primary.main',
    borderRadius: { xs: 1, sm: 2 },
  },
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0,0,0,0.1)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'primary.main',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: 'primary.dark',
      },
    },
  },
  flashAnimation: {
    animation: 'flash 2s infinite',
    '@keyframes flash': {
      '0%, 50%': { opacity: 1 },
      '25%, 75%': { opacity: 0.4 },
    },
  },
} as const
