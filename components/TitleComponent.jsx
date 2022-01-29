import { useEffect, useState } from "react";

const TitleComponent = ({
  loading, upscaleProgress, downloadReady
}) => {
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
        {loading && (
          <div className="absolute bottom-24">
            <div className=" bg-gray-200 h-1 w-60 md:w-96">
              <div
                className="bg-blue h-1 transition-all duration-1000 ease-linear"
                style={{
                  width: `${upscaleProgress * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <h1 id="title" className="absolute select-none bottom-4 lg:text-6xl md:text-4xl text-2xl font-bold mt-10">
          { downloadReady ? "Download" : (loading ? "Expanding" : "Expand") } your{" "}
          <span className="text-pink">
            {"waifu"}
            {loading ? loadingText : "!"}
          </span>
        </h1>
      </div>
    </>
  );
};

export default TitleComponent;
