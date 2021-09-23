import { PINK } from "../constants/colors";

const HeroComponent = ({ loading, loadingLink }) => {
  return (
    <main className="flex flex-col items-center flex-shrink justify-center w-full p-10 text-center">
      <br />
      {loading && <img src={loadingLink} />}{" "}
      <h1 className="text-6xl font-bold">
        {loading ? "Expanding" : "Expand"} your{" "}
        <span style={{ color: PINK }}>
          {"waifu"}
          {loading && "..."}
        </span>
      </h1>
    </main>
  );
};

export default HeroComponent;
