const TitleComponent = ({ loading }) => {
  return (
    <main className="flex flex-col items-center flex-shrink justify-center w-full p-10 text-center">
      <br />
      <h1 className="text-6xl font-bold" style={{ textShadow: "white 0px 2px 4px" }}>
        {loading ? "Expanding" : "Expand"} your{" "}
        <element class="text-pink">
          {"waifu"}
          {loading && "..."}
        </element>
      </h1>
    </main>
  );
};  

export default TitleComponent;
