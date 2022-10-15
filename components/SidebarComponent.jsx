import RunComponent from './RunComponent'
import TagComponent from './TagComponent'
import Router from 'next/router'
import { useImageStore, useAppStateStore } from '../services/useState'
import { UploadSVG } from './SVGComponents'
import { CopyComponent, DownloadComponent } from './ButtonComponents'

const Sidebar = () => {
  const showSidebar = useAppStateStore((state) => state.showSidebar)
  const [outputURI, tags] = useImageStore((state) => [state.outputURI, state.tags])

  return (
    <div id="sidebar" className="w-80 flex flex-col fixed inset-y-0 z-20">
      <div
        className="relative flex-1 flex flex-col min-h-0 bg-gray-100 transition-all"
        style={{ left: `${showSidebar ? 0 : -100}%` }}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="">
            <div className="pt-5 mt-10 mb-10 mx-8 grid grid-cols-1 space-y-2">
              <MobileNavLinksComponent />
              <hr className="md:hidden" />
              <InputComponent />
              {outputURI != null ? (
                <>
                  <DownloadComponent />
                  <CopyComponent />
                </>
              ) : (
                <UpscaleContainer />
              )}
            </div>
            {tags != null && (
              <>
                <hr />
                <div className="mt-10 mx-3 space-y-2 grid grid-cols-1">
                  <TagComponent tags={tags} />
                </div>
              </>
            )}
          </div>
        </div>
        <GitHashComponent />
      </div>
    </div>
  )
}

function MobileNavLinksComponent() {
  return (
    <>
      <div className="md:hidden flex items-center space-x-2" onClick={() => Router.push('./about')}>
        <span className="text-2xl font-semibold text-black cursor-pointer">About</span>
      </div>
      <div className="md:hidden flex items-center space-x-2" onClick={() => Router.push('./donate')}>
        <span className="text-2xl font-semibold text-black cursor-pointer">Donate</span>
      </div>
    </>
  )
}

function UpscaleContainer() {
  return (
    <div id="upscale-button-container" className="flex justify-between gap-2">
      <RunComponent />
      <UpscaleFactorComponent />
    </div>
  )
}

function UpscaleFactorComponent() {
  const setUpscaleFactor = useImageStore((state) => state.setUpscaleFactor)

  return (
    <select
      id="resolution-select"
      className="form-select appearance-none border-none text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center w-16"
      onInput={(inp) => {
        setUpscaleFactor(parseInt(inp.target.value))
      }}
    >
      <option value="2">2&#215;</option>
      <option value="4">4&#215;</option>
      <option value="8">8&#215;</option>
    </select>
  )
}

const InputComponent = () => {
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  return (
    <>
      <button
        id="choose-image-button"
        type="button"
        className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center"
        onClick={() => {
          setInputModalOpen(true)
        }}
      >
        <UploadSVG /> <span>Choose Image/GIF</span>
      </button>
    </>
  )
}

function GitHashComponent() {
  return (
    <div className="bg-gray-100 flex justify-center items-center bottom-0 w-full h-4 text-center text-grey pt-5 pb-5">
      <div className="text-xs">
        Built from commit{' '}
        <a
          href={`https://github.com/TheFutureGadgetsLab/WaifuXL/tree/${__LONG_HASH__}`}
          className="text-pink underline"
          target="_blank"
          rel="noreferrer"
        >
          {__SHORT_HASH__}
        </a>
      </div>
    </div>
  )
}

export { Sidebar, UpscaleContainer, UpscaleFactorComponent }
