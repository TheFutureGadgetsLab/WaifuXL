import { useEffect, useRef } from 'react'
import { setDataURIFromFile, getDataURIFromInput } from '../services/imageUtilities'
import { CloseSVG } from './SVGComponents'
import { useImageStore, useAppStateStore } from '../services/useState'

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

function UploadButtonComponent() {
  const setFileName = useImageStore((state) => state.setFileName)
  const setInputURI = useImageStore((state) => state.setInputURI)

  return (
    <div className="grid grid-cols-1">
      <button
        id="upload-button"
        type="button"
        className="relative mt-7 rounded-md right-0 bottom-0 text-white shadow-sm px-4 py-1
text-base font-medium h-12 focus:outline-none focus:ring-2 focus:ring-offset-2
border-blue border-2 bg-blue hover:bg-blue hover:text-white disabled:bg-white disabled:text-gray-200 disabled:border-gray-200"
      >
        <label className="absolute left-0 top-0 w-full h-full cursor-pointer">
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
        Upload
      </button>
    </div>
  )
}

function DoneButtonComponent() {
  const setTags = useImageStore((state) => state.setTags)
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setInputModalOpen = useAppStateStore((state) => state.setInputModalOpen)
  const inputURI = useImageStore((state) => state.inputURI)

  return (
    <div className="md:grid-cols-1 md:grid hidden">
      <button
        id="done-button"
        type="button"
        className="mt-7 rounded-md right-0 bottom-0 text-blue shadow-sm px-4 py-1
text-base font-medium h-12 focus:outline-none focus:ring-2 focus:ring-offset-2
border-blue border-2 bg-white hover:bg-blue hover:text-white disabled:bg-white disabled:text-gray-200 disabled:border-gray-200"
        onClick={() => {
          setInputURI(inputURI)
          setTags(null)
          setInputModalOpen(false)
        }}
      >
        Done
      </button>
    </div>
  )
}

function PresetSelectorComponent() {
  const setInputURI = useImageStore((state) => state.setInputURI)
  const setFileName = useImageStore((state) => state.setFileName)

  return (
    <label>
      <span className="text-gray-700">Preset Images</span>
      <select
        id="preset-select"
        className="form-select border-none rounded mt-1 block text-ellipsis w-full p-3 bg-blue text-white cursor-pointer"
        onInput={(inp) => {
          const [name, url] = inp.target.value.split('|')
          getDataURIFromInput(url).then((uri) => setInputURI(uri))
          setFileName(`example_${name}`)
        }}
      >
        <option>Select a Preset</option>
        <option value="ozen|https://i.imgur.com/Sf6sfPj.png">Ozen</option>
        <option value="eat|https://c.tenor.com/rnhV3fu39f8AAAAM/eating-anime.gif">Eating (GIF)</option>
        <option value="senjougahara|https://i.imgur.com/cMX8YcK.jpg">Hitagi Senjougahara</option>
        <option value="moomin|https://i.imgur.com/9I91yMq.png">Moomin</option>
        <option value="megumin|https://i.imgur.com/BKBt6bC.png">Megumin</option>
        <option value="aqua|https://i.imgur.com/yhIwVjZ.jpeg">Aqua</option>
        <option value="natsumi|https://i.imgur.com/yIIl7Z1.png">Kurobe Natsumi</option>
      </select>
    </label>
  )
}

export { ModalComponent, PresetMenuComponent }
