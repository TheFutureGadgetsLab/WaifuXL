import Image from 'next/image'
import Kizuna from '@/public/images/DesktopBG.svg'
import Mobile from '@/public/images/MobileBG.svg'

export function LeftArrowSVG({ onClick, hidden }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
      className="mt-1 cursor-pointer"
      onClick={onClick}
      visibility={hidden ? 'hidden' : 'visible'}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  )
}

export function RighArrowSVG({ onClick, hidden }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
      className="mt-1 cursor-pointer"
      onClick={onClick}
      visibility={hidden ? 'hidden' : 'visible'}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
    </svg>
  )
}
export function DownloadSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      className="w-6 h-6 mr-2"
    >
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z" />
      </g>
    </svg>
  )
}

export function CopySVG() {
  return (
    <svg className="w-6 h-6 mr-2" fill="#FFFFFF" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M308.51,450H80.59a15,15,0,0,1-15-15V143.93a15,15,0,0,1,15-15H308.51a15,15,0,0,1,15,15V435A15,15,0,0,1,308.51,450ZM95.59,420H293.51V158.93H95.59Z" />
        <path d="M389.44,369.07H308.51a15,15,0,0,1,0-30h65.93V78H176.52v65.92a15,15,0,0,1-30,0V63a15,15,0,0,1,15-15H389.44a15,15,0,0,1,15,15V354.07A15,15,0,0,1,389.44,369.07Z" />
      </g>
    </svg>
  )
}

export function UploadingSVG() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2 animate-spin">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  )
}

export function UploadSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      className="w-6 h-6 mr-2"
    >
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z" />
      </g>
    </svg>
  )
}

export function ErrorSVG({ color }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" className={`stroke-${color}-800`}>
      <path d="M22.65 26.35H25.65V13.7H22.65ZM24 34Q24.7 34 25.175 33.525Q25.65 33.05 25.65 32.35Q25.65 31.65 25.175 31.175Q24.7 30.7 24 30.7Q23.3 30.7 22.825 31.175Q22.35 31.65 22.35 32.35Q22.35 33.05 22.825 33.525Q23.3 34 24 34ZM24 44Q19.75 44 16.1 42.475Q12.45 40.95 9.75 38.25Q7.05 35.55 5.525 31.9Q4 28.25 4 24Q4 19.8 5.525 16.15Q7.05 12.5 9.75 9.8Q12.45 7.1 16.1 5.55Q19.75 4 24 4Q28.2 4 31.85 5.55Q35.5 7.1 38.2 9.8Q40.9 12.5 42.45 16.15Q44 19.8 44 24Q44 28.25 42.45 31.9Q40.9 35.55 38.2 38.25Q35.5 40.95 31.85 42.475Q28.2 44 24 44ZM24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24ZM24 41Q31 41 36 36Q41 31 41 24Q41 17 36 12Q31 7 24 7Q17 7 12 12Q7 17 7 24Q7 31 12 36Q17 41 24 41Z" />
    </svg>
  )
}

export function CloseSVG({ onClick }) {
  return (
    <svg
      id="close-button"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
      className="mt-3 mr-3 cursor-pointer"
      onClick={onClick}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  )
}

export function UpscaleSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      className="w-6 h-6 mr-2"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z" />
    </svg>
  )
}

export function GitHubSVG({ className }) {
  return (
    <a aria-label="Github Link" href="https://github.com/TheFutureGadgetsLab/WaifuXL" target="_blank" rel="noreferrer">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" className={className}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>
  )
}

export function BackgroundImage() {
  const css = { width: 'auto', height: '95vh' }
  return (
    <>
      <Image
        src={Mobile}
        className="-z-50 visible md:hidden block fixed right-0 bottom-0"
        priority={true}
        alt="Mobile BG"
      />
      <Image
        src={Kizuna}
        className="-z-50 hidden md:block fixed right-0 bottom-0"
        style={css}
        priority={true}
        alt="Kizuna AI background"
      />
    </>
  )
}
