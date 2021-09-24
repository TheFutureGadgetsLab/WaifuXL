const TitleComponent = ({ loading }) => {
  return (
    <main className="flex flex-col items-center flex-shrink justify-center w-full p-10 text-center">
      <br />
      <h1 className="text-6xl font-bold" style={{ textShadow: "white 0px 2px 4px" }}>
        {loading ? "Expanding" : "Expand"} your{" "}
        <span className="text-pink">
          {"waifu"}
          {loading && "..."}
        </span>
      </h1>
    </main>
  );
};  

export default TitleComponent;
