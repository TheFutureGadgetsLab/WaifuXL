import { useEffect, useState } from "react";
import Tooltip from "./TooltipComponent";

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function truncateString(str) {
  str = cleanString(str);
  const split = str.length > 13 ? str.slice(0, 13) + "…" : str;
  return split;
}

function cleanString(str) {
  return titleCase(str.replace(/_/g, " ").split("(")[0]);
}

function buildTagLine(x) {
  const [isHidden, setIsHidden] = useState(true);
  function handleMouseEnter() {
    setIsHidden(false);
  }
  function handleMouseLeave() {
    setIsHidden(true);
  }

  return (
    <div className="grid grid-cols-2 font-mono h-4" key={x[0]}>
      <span className="">
        <Tooltip tooltipText={cleanString(x[0])} isHidden={isHidden}></Tooltip>
        <span
          onMouseEnter={(e) => handleMouseEnter()}
          onMouseLeave={(e) => handleMouseLeave()}
        >
          {truncateString(x[0])}
        </span>
      </span>
      <div
        className="top-1 w-full relative bg-gray-200 rounded-full text-center text-black"
        style={{ height: "1rem" }}
      >
        <div className="left-0 absolute w-full" style={{ top: "-3.5px" }}>
          <span className="text-center">{Math.round(x[1] * 100)}%</span>
        </div>
        <div
          className="bg-blue font-medium p-0.5 leading-none rounded-full"
          style={{ width: `${Math.round(x[1] * 100)}%`, height: "1rem" }}
        ></div>
      </div>
    </div>
  );
}

const TagComponent = ({ tags }) => {
  const [tagPage, setTagPage] = useState(0);
  const [charPage, setCharPage] = useState(0);

  useEffect(async () => {
    console.log(tags);
  }, []);

  return (
    <>
      <div
        className="text-xl font-bold grid grid-cols-6 pb-3"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        <span className="col-span-4">Tags</span>
        {tagPage > 0 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
            className="mt-1 cursor-pointer"
            onClick={(e) => setTagPage(tagPage - 1)}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        ) : (
          <span></span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
          className="mt-1 cursor-pointer"
          onClick={(e) => setTagPage(tagPage + 1)}
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
        </svg>
      </div>
      {tags.topDesc
        .slice(10 * tagPage, 10 * (tagPage + 1))
        .map((x) => buildTagLine(x))}
      <div
        className="text-xl font-bold grid grid-cols-6 pt-10 pb-3"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        <span className="col-span-4">Characters</span>
        {charPage > 0 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
            className="mt-1 cursor-pointer"
            onClick={(e) => setCharPage(charPage - 1)}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        ) : (
          <span></span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
          className="mt-1 cursor-pointer"
          onClick={(e) => setCharPage(charPage + 1)}
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
        </svg>
      </div>
      {tags.topChars
        .slice(10 * charPage, 10 * (charPage + 1))
        .map((x) => buildTagLine(x))}
      <div
        className="text-xl font-bold pt-10 pb-3"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Explicitness
      </div>
      {tags.rating.map((x) => buildTagLine(x))}
    </>
  );
};
export default TagComponent;
