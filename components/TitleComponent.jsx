import { useEffect, useState } from "react";

const TitleComponent = ({ loading, upscaleProgress }) => {
  const [loadingText, setLoadingText] = useState("");
  useEffect(async () => {
    const interval = setInterval(function () {
      loadingText == ""
        ? setLoadingText(".")
        : loadingText == "."
        ? setLoadingText("..")
        : loadingText == ".."
        ? setLoadingText("...")
        : setLoadingText("");
      clearInterval(interval);
    }, 750);
  });
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full text-center">
        <h1 className="text-6xl font-bold mt-10">
          {loading ? "Expanding" : "Expand"} your{" "}
          <span className="text-pink">
            {"waifu"}
            {loading && loadingText}
          </span>
        </h1>
        <br />
        {loading && upscaleProgress != null && (
          <>
            <span>
              Frame {upscaleProgress[0]} / {upscaleProgress[1]}
            </span>
            <div className=" bg-gray-200 h-1" style={{ width: "700px" }}>
              <div
                className="bg-blue h-1"
                style={{
                  width: `${(upscaleProgress[0] / upscaleProgress[1]) * 100}%`,
                }}
              ></div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TitleComponent;
