import { CopyComponent, DownloadComponent } from '@/components/ButtonComponents'
import { useAppStateStore, useImageStore } from '@/services/useState'

import RunComponent from '@/components/RunComponent'
import TagComponent from '@/components/TagComponent'
import { Button } from './catalyst/button'
import { ArrowUpTrayIcon } from '@heroicons/react/16/solid'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Select } from '@/components/catalyst/select'

const Sidebar = () => {
  const { outputURI, tags } = useImageStore()

  return (
    <div id="sidebar" className="absolute w-80 flex flex-col inset-y-0 z-20 h-full">
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
    <Field>
      <Select
      color="pink"
      id="resolution-select"
      onInput={(inp) => {
        setUpscaleFactor(parseInt(inp.target.value))
      }}
      disabled={running}
    >
      <option value="2">2&#215;</option>
      <option value="4">4&#215;</option>
      <option value="8">8&#215;</option>
    </Select>
    </Field>
  )
}

const InputComponent = () => {
  const { setInputModalOpen, running } = useAppStateStore()

  return (
    <Button
      color="pink"
      onClick={() => {
        setInputModalOpen(true)
      }}
      disabled={running}
    >
      <ArrowUpTrayIcon /> 
      <span className="text-white">Choose Image/GIF</span>
    </Button>
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
