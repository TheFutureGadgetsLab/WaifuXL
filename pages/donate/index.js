import { PINK } from "../../constants/colors";
import NavbarComponent from "../../components/NavbarComponent";
export default function About() {
  return (
    <div
      className="flex flex-col items-center min-h-screen"
      style={{ backgroundImage: `url("bg.png")`, backgroundSize: "cover" }}
    >
      <NavbarComponent />
      <main className="flex flex-col items-center flex-shrink justify-center w-full p-10 text-center">
        <br />
        <h1
          className="text-6xl font-bold"
          style={{ textShadow: "white 0px 2px 4px" }}
        >
          Donate To <span style={{ color: PINK }}>{"Us"}</span>
        </h1>
      </main>
    </div>
  );
}
