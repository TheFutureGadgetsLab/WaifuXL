import { useEffect } from 'react'
import { upScaleFromURI } from '@/services/processingUtilities'
import { initializeONNX } from '@/services/inference/utils'
import { UpscaleSVG } from '@/components/SVGComponents'
import { useImageStore, useAppStateStore } from '@/services/useState'

const RunComponent = () => {
  const [setOutputURI, setUpscaleFactor, setTags, uri, extension, upscaleFactor] = useImageStore((state) => [
    state.setOutputURI,
    state.setUpscaleFactor,
    state.setTags,
    state.inputURI,
    state.extension,
    state.upscaleFactor,
  ])

  const [setDownloadReady, setRunning, setErrorMessage, setLoadProg, running, loadProg] = useAppStateStore((state) => [
    state.setDownloadReady,
    state.setRunning,
    state.setErrorMessage,
    state.setLoadProg,
    state.running,
    state.loadProg,
  ])

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
        setDownloadReady(true)
        setRunning(false)
        setUpscaleFactor(2)
      })
  }, [running])

  return (
    <button
      className="grow text-white font-bold py-2 px-4 rounded drop-shadow-lg bg-pink inline-flex items-center disabled:bg-gray-400 disabled:opacity-60 disabled:text-white disabled:cursor-not-allowed"
      disabled={modelLoading || running}
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
