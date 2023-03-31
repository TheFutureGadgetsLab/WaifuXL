import { initializeONNX, upScaleFromURI } from '@/services/inference/utils'
import { useAppStateStore, useImageStore } from '@/services/useState'

import { UpscaleSVG } from '@/components/SVGComponents'

const RunComponent = () => {
  const { setOutputURI, setUpscaleFactor, setTags, inputURI, extension, upscaleFactor } = useImageStore()
  const { setDownloadReady, setRunning, setErrorMessage, setLoadProg, running, loadProg } = useAppStateStore()

  const modelLoading = loadProg >= 0

  return (
    <button
      className="grow text-white font-bold py-2 px-4 overflow-hidden rounded drop-shadow-lg bg-pink inline-flex items-center disabled:bg-gray-400 disabled:opacity-60 disabled:text-white disabled:cursor-not-allowed"
      disabled={modelLoading || running}
      onClick={() => {
        setLoadProg(0)
        initializeONNX(setLoadProg)
          .then(() => {
            setRunning(true)
          })
          .then(() => {
            upScaleFromURI(extension, setTags, inputURI, upscaleFactor)
              .then((result) => {
                setOutputURI(result)
                incrementCounter()
              })
              .catch((error) => {
                setErrorMessage(error)
              })
              .finally(() => {
                setDownloadReady(true)
                setRunning(false)
                setUpscaleFactor(2)
              })
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
