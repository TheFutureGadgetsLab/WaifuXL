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
  const split = str.length > 10 ? str.slice(0, 10) + "..." : str;
  return split;
}

function cleanString(str) {
  return titleCase(str.replace(/_/g, " ").split("(")[0]);
}

function buildTagLine(x) {
  return (
    <div className="grid grid-cols-7 font-mono h-4" key={x[0]}>
      <span className="col-span-3">
        <Tooltip tooltipText={cleanString(x[0])}>
          {truncateString(x[0])}{" "}
        </Tooltip>
      </span>
      <div
        className="w-full bg-gray-200 rounded-full col-span-3"
        style={{ height: "1rem" }}
      >
        <div
          className="bg-blue text-xs font-medium p-0.5 text-center leading-none rounded-full"
          style={{ width: `${Math.round(x[1] * 100)}%`, height: "1rem" }}
        ></div>
      </div>
      <span className="text-black ml-3">{Math.round(x[1] * 100)}% </span>
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
      <br />
      <div
        className="text-xl font-bold"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Character
      </div>
      {tags.topChars.map((x) => buildTagLine(x))}
      <br />
      <div
        className="text-xl font-bold"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Explicitness
      </div>
      {tags.rating.map((x) => (
        <div className="grid grid-cols-7 font-mono h-4" key={x[0]}>
          <span className="col-span-3">
            {x[0] == "s" ? "Safe" : x[0] == "e" ? "Explicit" : "Questionable"}
          </span>
          <div
            className="w-full bg-gray-200 rounded-full col-span-3"
            style={{ height: "1rem" }}
          >
            <div
              className="bg-blue text-xs font-medium p-0.5 text-center leading-none rounded-full"
              style={{ width: `${Math.round(x[1] * 100)}%`, height: "1rem" }}
            ></div>
          </div>
          <span className="text-black ml-3">{Math.round(x[1] * 100)}% </span>
        </div>
      ))}
    </>
  );
};
export default TagComponent;
