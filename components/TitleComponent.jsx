const TitleComponent = ({ loading }) => {
  return (
    <main className="flex flex-col items-center flex-shrink justify-center w-full p-10 text-center">
      <h1 className="text-6xl font-bold mt-10">
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
