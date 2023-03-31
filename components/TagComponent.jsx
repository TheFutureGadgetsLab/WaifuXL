import { LeftArrowSVG, RighArrowSVG } from '@/components/SVGComponents'

import ProgressBar from '@ramonak/react-progress-bar'
import Tooltip from '@/components/TooltipComponent'
import { useState } from 'react'

const TagComponent = ({ tags }) => {
  return (
    <>
      <TagSection tags={tags.topDesc} name="Tags" />
      <TagSection tags={tags.topChars} name="Characters" />
      <ExplicitnessSection tags={tags.rating} />
    </>
  )
}

function TagLine({ x }) {
  const [isHidden, setIsHidden] = useState(true)
  const perc = Math.round(x[1] * 100)
  const clean = cleanString(x[0])
  const trunc = truncateString(x[0])
  return (
    <tr>
      <th align="left" className="font-mono font-normal">
        <Tooltip tooltipText={clean} isHidden={isHidden} />
        <span onMouseEnter={(e) => setIsHidden(false)} onMouseLeave={(e) => setIsHidden(true)}>
          {trunc}
        </span>
      </th>
      <th align="left" colSpan={2}>
        <ProgressBar
          completed={perc}
          bgColor="#44ABBC"
          labelAlignment="left"
          labelColor="#000"
          animateOnRender={true}
        />
      </th>
    </tr>
  )
}

function TagSection({ tags, name }) {
  const [tagPage, setTagPage] = useState(0)
  const curTags = tags.slice(10 * tagPage, 10 * (tagPage + 1))
  const maxTagPage = Math.ceil(tags.length / 10) - 1
  return (
    <table>
      <tbody>
        <tr>
          <th align="left" className="text-xl font-bold" width="145px">
            {name}
          </th>
          <th align="right">
            <LeftArrowSVG onClick={() => setTagPage(tagPage - 1)} hidden={tagPage == 0} />
          </th>
          <th align="right">
            <RighArrowSVG onClick={() => setTagPage(tagPage + 1)} hidden={tagPage >= maxTagPage} />
          </th>
        </tr>
        {curTags.map((x) => (
          <TagLine x={x} key={x} />
        ))}
      </tbody>
    </table>
  )
}

function ExplicitnessSection({ tags }) {
  return (
    <table>
      <tbody>
        <tr>
          <th align="left" className="text-xl font-bold" width="145px">
            Explicitness
          </th>
        </tr>
        {tags.map((x) => (
          <TagLine x={x} key={x} />
        ))}
      </tbody>
    </table>
  )
}

function titleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase()
  })
}

function truncateString(str) {
  str = cleanStringRemoveParen(str)
  return str.length > 13 ? str.slice(0, 13) + '…' : str
}

function cleanStringRemoveParen(str) {
  return titleCase(str.split('(')[0].replace(/_/g, ' '))
}

function cleanString(str) {
  return titleCase(str.replace(/_/g, ' '))
}

export default TagComponent
