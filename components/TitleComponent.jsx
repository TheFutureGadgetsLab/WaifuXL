const TitleComponent = ({ loading, upscaleProgress }) => {
  return (
    <>
      <main className="flex flex-col items-center flex-shrink justify-center w-full p-10 text-center">
        {loading && upscaleProgress != null && (
          <>
            <span >Frame {upscaleProgress[0]} / {upscaleProgress[1]}</span>
            <div className="w-full bg-gray-200 h-1">
              <div
                className="bg-blue h-1"
                style={{
                  width: `${(upscaleProgress[0] / upscaleProgress[1]) * 100}%`,
                }}
              ></div>
            </div>
          </>
        )}

        <h1 className="text-6xl font-bold mt-10">
          {loading ? "Expanding" : "Expand"} your{" "}
          <span className="text-pink">
            {"waifu"}
            {loading && "..."}
          </span>
        </h1>
      </main>
    </>
  );
};

export default TitleComponent;
