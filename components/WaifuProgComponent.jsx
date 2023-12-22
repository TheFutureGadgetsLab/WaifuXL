import { useEffect, useState } from 'react'

import { useAppStateStore } from '@/services/useState'

const WaifuProgressComponent = () => {
  const [loadingText, setLoadingText] = useState('')
  const { running, downloadReady, modelLoading } = useAppStateStore()

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => (prev === '...' ? '' : `${prev}.`))
    }, 750)
    return () => clearInterval(interval)
  }, [])

  const title = modelLoading ? (
    <>
      Preparing to <span className="text-pink-100">run{loadingText}</span>
    </>
  ) : (
    <>
      {downloadReady ? 'Download' : running ? 'Expanding' : 'Expand'} your{' '}
      <span className="text--100">waifu{running ? loadingText : '!'}</span>
    </>
  )

  return (
    <div className="flex flex-col items-center justify-center w-full text-center md:mt-10">
      <h1 id="title" className="select-none lg:text-6xl md:text-4xl text-2xl font-bold">
        {title}
      </h1>
    </div>
  )
}

export default WaifuProgressComponent
