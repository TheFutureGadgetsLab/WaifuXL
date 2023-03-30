import { createRef, useEffect, useState } from 'react'

import { BackgroundImage } from '@/components/SVGComponents'
import Image from 'next/image'
import NavbarComponent from '@/components/NavbarComponent'
import kofi from '@/public/images/koficup.webp'
import pj from '@/public/images/chibi_pablo.webp'
import { sleep } from '@/services/inference/utils'

export default function Donate() {
  useEffect(() => {
    document.body.style.overflow = 'auto'
  }, [])

  return (
    <>
      <span className="hidden md:block">
        <BackgroundImage />
      </span>
      <div className="flex flex-col items-center min-h-screen">
        <NavbarComponent currentPage="donate" />
        <Image alt="DonatePls" src={pj} className="md:h-96 h-64 float-center w-auto mt-6 md:mt-0" priority={true} />
        <main className="items-center justify-center lg:w-8/12 text-center">
          <div className="md:text-center lg:mt-20 mt-5 lg:text-6xl text-2xl font-black">Donation Links</div>
          <div className="text-left flex items-center flex-col">
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
        <Image alt="Crypto Logo" src={imgPath} width="1" height="1" className="h-6 w-auto pr-2" />
        <span className="font-mono block md:hidden">{truncateString(addr, 16)}</span>
        <span className="font-mono md:block hidden">{addr}</span>
        <Image alt="Crypto Logo" src="./images/copy.svg" width="1" height="1" className="h-5 w-auto pl-3" />
      </button>
      <Tooltip tooltipText="Copied!" isHidden={isHidden} />
    </div>
  )
}

function KofiComponent() {
  return (
    <button className="hover:bg-blue-700 text-black font-bold py-2 px-4 rounded inline-flex items-center w-max">
      <Image alt="Kofi Logo" src={kofi} className="h-4 w-auto pr-2" />

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

export function truncateString(str, n) {
  return str.length > n ? str.substr(0, n - 1) + '...' : str
}
