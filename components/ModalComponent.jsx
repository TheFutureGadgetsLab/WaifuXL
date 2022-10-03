import { useEffect, useRef } from 'react'
import { setDataURIFromFile } from '../services/imageUtilities'
import { CloseSVG } from './SVGComponents'
import { useImageStore, useAppStateStore } from '../services/useState'
import { DoneButtonComponent, PresetSelectorComponent, UploadButtonComponent } from './ButtonComponents'

function ModalComponent() {
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  const setFileName = useImageStore((state) => state.setFileName)
  const inputModalOpen = useAppStateStore((state) => state.inputModalOpen)

  const divRef = useRef(null)
  function focusDiv() {
    divRef.current?.focus()
  }

  useEffect(() => {
    focusDiv()
  }, [divRef])

  return (
    <>
      {inputModalOpen && (
        <div className="w-80 flex flex-col fixed inset-y-0 z-20">
          <div
            id="modal-component-container"
            className="absolute inset-0 overflow-y-auto w-screen h-screen m-0"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            tabIndex="-1"
            ref={divRef}
            onKeyDown={(e) => {
              setInputModalOpen(e.key != 'Escape')
              setFileName()
            }}
          >
            <div
              id="modal-bg"
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity w-screen h-screen"
              aria-hidden="true"
              onClick={(e) => {
                setInputModalOpen(false)
                setFileName()
              }}
            />
            <div id="modal-container" className="flex items-center justify-center w-screen h-screen">
              <div
                id="modal"
                className="bg-white rounded-lg shadow-xl transform transition-all text-center w-full h-full md:w-auto md:h-auto"
              >
                <div>
                  <CloseSVG
                    onClick={(e) => {
                      setInputModalOpen(false)
                      setFileName()
                    }}
                  />
                </div>
                <PreviewComponent />
                <PresetMenuComponent />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PresetMenuComponent() {
  return (
    <div id="preset-menu" className="mt-10 p-3 flex justify-between relative gap-4">
      <PresetSelectorComponent />
      <UploadButtonComponent />
      <DoneButtonComponent />
    </div>
  )
}

function PreviewComponent() {
  const setInputURI = useImageStore((state) => state.setInputURI)
  const inputURI = useImageStore((state) => state.inputURI)
  const setFileName = useImageStore((state) => state.setFileName)

  return (
    <label
      className="flex flex-col items-center justify-center cursor-pointer mt-16 h-96 m-3 bg-contain bg-origin-content p-4 bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${inputURI})`,
        boxShadow: 'inset 0px 0px 12px #00000050',
      }}
    >
      <label className="flex items-center px-4 py-6 tracking-wide cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) {
              setDataURIFromFile(e.target.files[0], setInputURI)
              setFileName(e.target.files[0].name.split('.')[0])
            }
          }}
        />
      </label>
    </label>
  )
}

export { ModalComponent, PresetMenuComponent }
