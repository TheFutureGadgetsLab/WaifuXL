import { useEffect, useState } from "react";

const TitleComponent = ({ loading, downloadReady, modelLoading, mobile }) => {
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
        {modelLoading ? (
          <h1
            id="title"
            className={`select-none absolute bottom-20 lg:text-6xl md:text-4xl text-2xl font-bold mt-10`}
          >
            Preparing to{" "}
            <span className="text-pink">run{loadingText}</span>
          </h1>
        ) : (
          <h1
            id="title"
            className={`select-none absolute bottom-20 lg:text-6xl md:text-4xl text-2xl font-bold mt-10`}
          >
            {downloadReady ? "Download" : loading ? "Expanding" : "Expand"} your{" "}
            <span className="text-pink">
              {"waifu"}
              {loading ? loadingText : "!"}
            </span>
          </h1>
        )}
      </div>
    </>
  );
};

export default TitleComponent;
