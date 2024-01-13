import { NewsDown, NewsUp } from './SVGComponents'
import React, { useState } from 'react'

const NewsBox = () => {
  const [isFolded, setIsFolded] = useState(false)

  const toggleFold = () => {
    setIsFolded(!isFolded)
  }

  return (
    <div className="absolute z-10 w-80 left-80">
      <div className="shadow-lg bg-white">
        <div className="flex justify-between items-center py-2 px-4 border-b">
          <h3 className="text-lg font-medium">Latest News</h3>
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={toggleFold}>
            {isFolded ? <NewsDown /> : <NewsUp />}
          </button>
        </div>
        {!isFolded && renderNewsItems()}
      </div>
    </div>
  )
}
const renderNewsItems = () => {
  return (
    <div className="px-4 py-2">
       <p className="text-blue">
        <span className="text-blue">01/12/2024: </span>
        <span className="text-black">Hi Fam</span>
      </p>
      <p className="text-blue">
        <span className="text-blue">03/25/2023: </span>
        <span className="text-black">WaifuXL v1.5.0 Released!</span>
      </p>
      <ul className="pl-1">
        <span className="font-bold">Clear browser cache if having issues!</span>
        <li>🌸 Upsampling is now faster!</li>
        <li>🌸 Website fully rewritten.</li>
        <li>🌸 Still better than waifu2x.</li>
      </ul>
      <p className="text-blue pt-2">
        <span className="text-blue">06/11/2022: </span>
        <span className="text-black">WaifuXL v1.0.0 Released!</span>
      </p>
      <ul className="pl-1">
        <li>🌸 Better than waifu2x.</li>
      </ul>
    </div>
  )
}

export default NewsBox
