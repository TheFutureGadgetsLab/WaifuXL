import { useEffect } from "react";
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
  const split = str.length > 12 ? str.slice(0, 12) + "..." : str;
  return split;
}

function cleanString(str) {
  return titleCase(str.replace(/_/g, " ").split("(")[0]);
}

function buildTagLine(x) {
  return (
    <div className="grid grid-cols-2 font-mono h-4" key={x[0]}>
      <span className="z-10">
        <Tooltip tooltipText={cleanString(x[0])}>
          {truncateString(x[0])}{" "}
        </Tooltip>
      </span>
      <div
        className="top-1 w-full relative bg-gray-200 rounded-full text-center text-black"
        style={{ height: "1rem" }}
      >
        <div className="left-0 absolute w-full" style={{ top: "-3px" }}>
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
  useEffect(async () => {
    console.log(tags);
  }, []);

  return (
    <>
      <div
        className="text-xl font-bold"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Tags
      </div>
      {tags.topDesc.map((x) => buildTagLine(x))}
      <div
        className="text-xl font-bold mt-10"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Character
      </div>
      {tags.topChars.map((x) => buildTagLine(x))}

      <div
        className="text-xl font-bold mt-10"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Explicitness
      </div>
      {tags.rating.map((x) => buildTagLine(x))}
    </>
  );
};
export default TagComponent;
