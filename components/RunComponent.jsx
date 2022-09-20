import { useEffect } from 'react'
import { upScaleFromURI } from '../services/processingUtilities'
import { initializeONNX } from '../services/inference/utils'
import { UpscaleSVG } from './SVGComponents'
import { useImageStore, useAppStateStore } from '../services/useState'

const RunComponent = () => {
  const setOutputURI = useImageStore((state) => state.setOutputURI)
  const setRunning = useAppStateStore((state) => state.setRunning)
  const setUpscaleFactor = useImageStore((state) => state.setUpscaleFactor)
  const setErrorMessage = useAppStateStore((state) => state.setErrorMessage)
  const setLoadProg = useAppStateStore((state) => state.setLoadProg)

  const running = useAppStateStore((state) => state.running)
  const loadProg = useAppStateStore((state) => state.loadProg)

  const setTags = useImageStore((state) => state.setTags)
  const uri = useImageStore((state) => state.inputURI)
  const extension = useImageStore((state) => state.extension)
  const upscaleFactor = useImageStore((state) => state.upscaleFactor)

  const modelLoading = loadProg >= 0

  useEffect(() => {
    if (!running) {
      return
    }

    upScaleFromURI(extension, setTags, uri, upscaleFactor)
      .then((result) => {
        setOutputURI(result)
        incrementCounter()
      })
      .catch((error) => {
        setErrorMessage(error)
      })
      .finally(() => {
        setRunning(false)
        setUpscaleFactor(2)
      })
  }, [running])

  return (
    <button
      className={`grow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded relative
        drop-shadow-lg inline-flex items-center ${!modelLoading && !running ? 'bg-pink' : 'bg-gray-300'}`}
      onClick={() => {
        setLoadProg(0)
        initializeONNX(setLoadProg)
          .then(() => {
            setRunning(true)
          })
          .catch(() => {
            setErrorMessage('Could not load model.')
          })
          .finally(() => {
            setLoadProg(-1)
          })
      }}
    >
      {modelLoading && ( // Model downloading progress displayed underneath button
        <div
          id="upscale-button-bg"
          className="bg-litepink absolute h-full left-0 rounded duration-300"
          style={{ width: `${loadProg * 100}%`, zIndex: -1, transitionProperty: 'width' }}
        />
      )}

      <UpscaleSVG />

      {running ? ( // Button text
        <span> Upscaling... </span>
      ) : !modelLoading ? (
        <span> Upscale </span>
      ) : (
        <span> Loading Model </span>
      )}
    </button>
  )
}

function incrementCounter() {
  // hit the api and note an image has been upscaled
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  }

  fetch('https://waifuxl_upscale_counter.haydnjonest8327.workers.dev/increment', requestOptions).catch((error) =>
    console.log('Error incrementing counter'),
  )
}

export default RunComponent
