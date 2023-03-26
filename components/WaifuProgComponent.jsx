import { useEffect, useState } from 'react'

import { useAppStateStore } from '@/services/useState'

const WaifuProgressComponent = () => {
  const [loadingText, setLoadingText] = useState('')

  const running = useAppStateStore((state) => state.running)
  const downloadReady = useAppStateStore((state) => state.downloadReady)
  const modelLoading = useAppStateStore((state) => state.modelLoading)

  useEffect(() => {
    const interval = setInterval(function () {
      loadingText == ''
        ? setLoadingText('.')
        : loadingText == '.'
        ? setLoadingText('..')
        : loadingText == '..'
        ? setLoadingText('...')
        : setLoadingText('')
      clearInterval(interval)
    }, 750)
  })
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full text-center md:mt-10">
        {modelLoading ? (
          <h1 id="title" className="select-none lg:text-6xl md:text-4xl text-2xl font-bold">
            Preparing to <span className="text-pink">run{loadingText}</span>
          </h1>
        ) : (
          <h1 id="title" className="select-none lg:text-6xl md:text-4xl text-2xl font-bold">
            {downloadReady && !running ? 'Download' : running ? 'Expanding' : 'Expand'} your{' '}
            <span className="text-pink">
              waifu
              {running ? loadingText : '!'}
            </span>
          </h1>
        )}
      </div>
    </>
  )
}

export default WaifuProgressComponent
