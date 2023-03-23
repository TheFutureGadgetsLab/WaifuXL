import { CopyComponent, DownloadComponent } from '@/components/ButtonComponents'
import { useAppStateStore, useImageStore } from '@/services/useState'

import RunComponent from '@/components/RunComponent'
import TagComponent from '@/components/TagComponent'
import { UploadSVG } from '@/components/SVGComponents'

const Sidebar = () => {
  const [outputURI, tags] = useImageStore((state) => [state.outputURI, state.tags])

  return (
    <div id="sidebar" className="w-80 flex flex-col fixed inset-y-0 z-20">
      <div className="relative flex-1 flex flex-col min-h-0 bg-gray-100">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="pt-5 mt-10 mb-10 mx-8 grid grid-cols-1 space-y-2">
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
  const running = useAppStateStore((state) => state.running)

  return (
    <select
      id="resolution-select"
      className="form-select appearance-none border-none text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center w-16 disabled:bg-gray-400 disabled:opacity-60 disabled:text-white disabled:cursor-not-allowed"
      onInput={(inp) => {
        setUpscaleFactor(parseInt(inp.target.value))
      }}
      disabled={running}
    >
      <option value="2">2&#215;</option>
      <option value="4">4&#215;</option>
      <option value="8">8&#215;</option>
    </select>
  )
}

const InputComponent = () => {
  const [setInputModalOpen, running] = useAppStateStore((state) => [state.setInputModalOpen, state.running])
  return (
    <button
      id="choose-image-button"
      type="button"
      className="text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center disabled:bg-gray-400 disabled:opacity-60 disabled:text-white disabled:cursor-not-allowed"
      onClick={() => {
        setInputModalOpen(true)
      }}
      disabled={running}
    >
      <UploadSVG /> <span>Choose Image/GIF</span>
    </button>
  )
}

function GitHashComponent() {
  return (
    <div className="bg-gray-100 flex justify-center items-center bottom-0 w-full h-4 text-center text-grey pt-5 pb-5">
      <div className="text-sm">
        Built from commit{' '}
        <a
          href={`https://github.com/TheFutureGadgetsLab/WaifuXL/tree/${__LONG_HASH__}`}
          className="text-blue underline"
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
