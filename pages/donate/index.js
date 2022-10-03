import NavbarComponent from '../../components/NavbarComponent'
import { createRef, useEffect, useState } from 'react'
import { GitHubSVG, KizunaBG } from '../../components/SVGComponents'
import { sleep } from '../../services/inference/utils'

export default function Donate() {
  useEffect(() => {
    document.body.style.overflow = 'auto'
  }, [])

  return (
    <>
      <KizunaBG />
      <div className="flex flex-col items-center min-h-screen">
        <NavbarComponent currentPage="donate" />
        <GitHubSVG className="absolute right-5 top-4 z-40" />
        <main className="items-center justify-center lg:w-8/12 p-10 text-center">
          <img src="./images/chibi_pablo.webp" className="md:h-96 h-64 float-left" />
          <div className="md:text-left lg:mt-20 mt-5 lg:text-6xl text-2xl font-black">Donation Links</div>
          <div className="text-left flex flex-col flex-grow flex-wrap">
            <KofiComponent />
            <CryptoComponent addr="0xDBF8321ba37D14eFc82BA1d9A416145EE039b78d" imgPath="./images/ETH.svg" />
            <CryptoComponent addr="33NgbSU66P42afwF3nbvn7qsYy4iJ3rRbL" imgPath="./images/BTC.svg" />
            <CryptoComponent addr="D5Zx9Uz6CLvKKEcdGH4R1hBLqeYwGdaFbP" imgPath="./images/DOGE.svg" />
            <CryptoComponent addr="MMWSSsvzUB2nWrYQU9f9SkV4tNKbAfk8gf" imgPath="./images/LTC.svg" />
          </div>
        </main>
      </div>
    </>
  )
}

function Tooltip({ children, tooltipText, isHidden }) {
  const tipRef = createRef(null)
  return (
    <div
      className="absolute right-full top-0 flex items-center transition-transform duration-200 ease-in-out"
      style={{ transform: `scale(${isHidden ? '0' : '1'})` }}
    >
      <div className="z-40 bg-black text-white px-4 py-2 rounded flex items-center" ref={tipRef}>
        {tooltipText}
      </div>
      {children}
    </div>
  )
}

function CryptoComponent({ addr, imgPath }) {
  const [isHidden, setIsHidden] = useState(true)
  return (
    <div id="eth-container" className="relative">
      <button
        className="hover:bg-blue-700 text-black relative font-bold py-2 px-4 rounded inline-flex items-center w-max"
        onClick={() => {
          navigator.clipboard.writeText(addr)
          setIsHidden(false)
          sleep(1000).then(() => setIsHidden(true))
        }}
      >
        <img className="h-6 pr-2" src={imgPath} />
        <a className="">
          <span className="font-mono">{addr}</span>
        </a>
        <img className="h-5 pr-2 absolute left-full" src="./images/copy.svg" />
      </button>
      <Tooltip tooltipText="Copied!" isHidden={isHidden} />
    </div>
  )
}

function KofiComponent() {
  return (
    <button className="hover:bg-blue-700 text-black font-bold py-2 px-4 rounded inline-flex items-center w-max">
      <img className="h-4 pr-2" src="/images/koficup.webp" />

      <a
        className="font-mono"
        href="https://ko-fi.com/thefuturegadgetslab/?hidefeed=true&widget=true&embed=true&preview=true"
        target="_blank"
        rel="noreferrer"
      >
        <span>Support us on Ko-fi</span>
      </a>
    </button>
  )
}
