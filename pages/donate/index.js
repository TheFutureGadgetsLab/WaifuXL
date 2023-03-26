import NavbarComponent from "../../components/NavbarComponent";
import SideNavbar from "../../components/SideNavbar";
import { createRef, useEffect, useState } from "react";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 0 24 24"
          width="32px"
          fill="#000000"
          className="md:hidden absolute left-5 top-4 z-40 cursor-pointer"
          onClick={(e) => setShowSidebar(!showSidebar)}
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
        <a
          aria-label="Github Link"
          href="https://github.com/TheFutureGadgetsLab/WaifuXL"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="absolute right-5 top-4 z-40"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
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
