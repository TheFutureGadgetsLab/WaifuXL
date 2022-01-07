import { useEffect } from "react";
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
      {tags.topDesc.map((x) => (
        <div className="grid grid-cols-2" key={x[0]}>
          {x[0].replace("_", " ")}
          <div className="w-full bg-gray-200 rounded-full" style={{height: "1rem"}}>
            <div
              className="bg-blue text-xs font-medium p-0.5 text-center leading-none rounded-full"
              style={{ width: `${Math.round(x[1] * 100)}%` }}
            >
              <span className="text-white">{Math.round(x[1] * 100)}% </span>
            </div>
          </div>
        </div>
      ))}
      <br />
      <div
        className="text-xl font-bold"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Character
      </div>
      {tags.topChars.map((x) => (
        <div className="grid grid-cols-2" key={x[0]}>
        {x[0].replace("_", " ")}
        <div className="w-full bg-gray-200 rounded-full" style={{height: "1rem"}}>
          <div
            className="bg-blue text-xs font-medium p-0.5 text-center leading-none rounded-full"
            style={{ width: `${Math.round(x[1] * 100)}%` }}
          >
            <span className="text-white">{Math.round(x[1] * 100)}% </span>
          </div>
        </div>
      </div>
    ))}
      <br />
      <div
        className="text-xl font-bold"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Explicitness
      </div>
      {tags.rating.map((x) => (
        <div key={x[0]}>
          {x[0] == "s" ? "Safe" : x[0] == "e" ? "Explicit" : "Unsure"}
        </div>
      ))}
    </>
  );
};
export default TagComponent;
