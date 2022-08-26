import { useEffect } from 'react'
import { upScaleFromURI } from '../services/processingUtilities'
import { initializeONNX } from '../services/inference/utils'
import { UpscaleSVG } from './SVGComponents'
import { useImageStore, useAppStateStore } from '../services/useState'

const RunComponent = () => {
  const setOutputURI = useImageStore((state) => state.setOutputURI)
  const setUserHasRun = useAppStateStore((state) => state.setUserHasRun)
  const setShouldRun = useAppStateStore((state) => state.setShouldRun)
  const setUpscaleFactor = useImageStore((state) => state.setUpscaleFactor)
  const setErrorMessage = useAppStateStore((state) => state.setErrorMessage)
  const setModelLoading = useAppStateStore((state) => state.setModelLoading)
  const setModelLoadProg = useAppStateStore((state) => state.setModelLoadProg)

  const shouldRun = useAppStateStore((state) => state.shouldRun)
  const modelLoading = useAppStateStore((state) => state.modelLoading)
  const loading = useAppStateStore((state) => state.loading)
  const modelLoadProg = useAppStateStore((state) => state.modelLoadProg)

  const setLoading = useAppStateStore((state) => state.setLoading)
  const setTags = useImageStore((state) => state.setTags)
  const uri = useImageStore((state) => state.inputURI)
  const extension = useImageStore((state) => state.extension)
  const upscaleFactor = useImageStore((state) => state.upscaleFactor)

  useEffect(() => {
    if (shouldRun) {
      // Async call to upscaleFromURI
      const asyncFn = async () => {
        try {
          const result = await upScaleFromURI(setLoading, extension, setTags, uri, upscaleFactor)
          setUserHasRun(true)
          // If the models output is valid
          if (result) {
            // Set the output and increment the counter
            setOutputURI(result)
            incrementCounter()
          }
        } catch (error) {
          console.log(error)
          setErrorMessage('Model failed to run.')
          return
        }

        setShouldRun(false)
        setUpscaleFactor(2)
      }
      asyncFn()
    }
  }, [shouldRun])

  return (
    <button
      className={`grow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded relative
        drop-shadow-lg inline-flex items-center ${!modelLoading && !loading ? 'bg-pink' : 'bg-gray-300'}`}
      onClick={async () => {
        setModelLoading(true)
        try {
          await initializeONNX(setModelLoadProg)
          setModelLoading(false)
          setShouldRun(true)
        } catch (error) {
          setErrorMessage('Could not load model.')
        }
      }}
    >
      {modelLoading && ( // Model downloading progress displayed underneath button
        <div
          id="upscale-button-bg"
          className="bg-litepink absolute h-full left-0 rounded duration-300"
          style={{ width: `${modelLoadProg * 100}%`, zIndex: -1, transitionProperty: 'width' }}
        ></div>
      )}

      <UpscaleSVG />

      {loading ? ( // Button text
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
  //hit the api and note an image has been upscaled
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  }

  fetch('https://waifuxl_upscale_counter.haydnjonest8327.workers.dev/increment', requestOptions).catch((error) =>
    console.log('Error incrementing counter'),
  )
}

export default RunComponent
