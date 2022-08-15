import NavbarComponent from "../../components/NavbarComponent";
import SideNavbar from "../../components/SideNavbar";
import { createRef, useEffect, useState } from "react";
import { GitHubSVG, HamSVG } from "../../components/SVGComponents";

function Tooltip({ children, tooltipText, isHidden }) {
  const tipRef = createRef(null);
  return (
    <div className="absolute right-full top-0 flex items-center transition-transform duration-200 ease-in-out"
      style={{ transform: `scale(${isHidden ? "0" : "1"})` }}>
        <div
          className={`z-40 bg-black text-white px-4 py-2 rounded flex items-center`}
          ref={tipRef}
        >
          {tooltipText}
        </div>
      {children}
    </div>
  );
}

export default function Donate() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isHiddenETH, setIsHiddenETH] = useState(true);
  const [isHiddenBTC, setIsHiddenBTC] = useState(true);
  const [isHiddenDOGE, setIsHiddenDOGE] = useState(true);
  const [isHiddenLITE, setIsHiddenLITE] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <>
      <SideNavbar showSidebar={showSidebar} currentPage="donate" />

      <div
        className="flex flex-col items-center min-h-screen"
        style={{ backgroundImage: `url("images/bg.svg")`, backgroundSize: "cover" }}
      >
        <NavbarComponent currentPage="donate" />
        <HamSVG onClick={() => setShowSidebar(!showSidebar)} className="md:hidden absolute left-5 top-4 z-40 cursor-pointer" />
        <GitHubSVG className="absolute right-5 top-4 z-40" />
        <main className="items-center justify-center lg:w-8/12 p-10 text-center">
          <img src="./images/chibi_pablo.png" className="md:h-96 h-64 float-left" />
          <div className="md:text-left lg:mt-20 mt-5 lg:text-6xl text-2xl font-black">
            Donation Links
          </div>
          <div className="text-left flex flex-col flex-grow flex-wrap">
            <button className="hover:bg-blue-700 text-black font-bold py-2 px-4 rounded inline-flex items-center w-max">
              <img className="h-4 pr-2" src="/images/koficup.png" />

              <a
                className="font-mono"
                href="https://ko-fi.com/thefuturegadgetslab/?hidefeed=true&widget=true&embed=true&preview=true"
              >
                <span>Support us on Ko-fi</span>
              </a>
            </button>
            <div id="eth-container" className="relative">
              <button
                className="hover:bg-blue-700 text-black relative font-bold py-2 px-4 rounded inline-flex items-center w-max"
                onClick={async () => {
                  navigator.clipboard.writeText(
                    "0xDBF8321ba37D14eFc82BA1d9A416145EE039b78d"
                  );
                  setIsHiddenETH(false);
                  await new Promise((r) => setTimeout(r, 1000));
                  setIsHiddenETH(true);
                }}
              >
                <img className="h-6 pr-2" src="./images/ETH.svg" />

                <a className="">
                  <span className="font-mono">
                    0xDBF8321ba37D14eFc82BA1d9A416145EE039b78d
                  </span>
                </a>
                <img className="h-5 pr-2 absolute left-full" src="./images/copy.svg" />
              </button>
              <Tooltip tooltipText={"Copied!"} isHidden={isHiddenETH}></Tooltip>
            </div>
            <div id=" btc-container" className="relative">
              <button
                className="hover:bg-blue-700 text-black relative font-bold py-2 px-4 rounded inline-flex items-center w-max"
                onClick={async () => {
                  navigator.clipboard.writeText(
                    "33NgbSU66P42afwF3nbvn7qsYy4iJ3rRbL"
                  );
                  setIsHiddenBTC(false);
                  await new Promise((r) => setTimeout(r, 1000));
                  setIsHiddenBTC(true);
                }}
              >
                <img className="h-6 pr-2" src="./images/BTC.svg" />
                <a className="">
                  <span className="font-mono">
                    33NgbSU66P42afwF3nbvn7qsYy4iJ3rRbL
                  </span>
                </a>
                <img className="h-5 pr-2 absolute left-full" src="./images/copy.svg" />
              </button>
              <Tooltip tooltipText={"Copied!"} isHidden={isHiddenBTC}></Tooltip>
            </div>
            <div id="doge-container" className="relative">
              <button
                className="hover:bg-blue-700 text-black relative font-bold py-2 px-4 rounded inline-flex items-center w-max"
                onClick={async () => {
                  navigator.clipboard.writeText(
                    "D5Zx9Uz6CLvKKEcdGH4R1hBLqeYwGdaFbP"
                  );
                  setIsHiddenDOGE(false);
                  await new Promise((r) => setTimeout(r, 1000));
                  setIsHiddenDOGE(true);
                }}
              >
                <img className="h-6 pr-2" src="./images/DOGE.svg" />
                <a className="">
                  <span className="font-mono">
                    D5Zx9Uz6CLvKKEcdGH4R1hBLqeYwGdaFbP
                  </span>
                </a>
                <img className="h-5 pr-2 absolute left-full" src="./images/copy.svg" />
              </button>
              <Tooltip
                tooltipText={"Copied!"}
                isHidden={isHiddenDOGE}
              ></Tooltip>
            </div>
            <div id="lite-container" className="relative">
              <button
                className="hover:bg-blue-700 text-black relative font-bold py-2 px-4 rounded inline-flex items-center w-max"
                onClick={async () => {
                  navigator.clipboard.writeText(
                    "MMWSSsvzUB2nWrYQU9f9SkV4tNKbAfk8gf"
                  );
                  setIsHiddenLITE(false);
                  await new Promise((r) => setTimeout(r, 1000));
                  setIsHiddenLITE(true);
                }}
              >
                <img className="h-6 pr-2" src="./images/LTC.svg" />
                <a className="">
                  <span className="font-mono">
                    MMWSSsvzUB2nWrYQU9f9SkV4tNKbAfk8gf
                  </span>
                </a>
                <img className="h-5 pr-2 absolute left-full" src="./images/copy.svg" />
              </button>
              <Tooltip
                tooltipText={"Copied!"}
                isHidden={isHiddenLITE}
              ></Tooltip>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
