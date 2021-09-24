import { PINK } from "../constants/colors";
import Router from "next/router";

const NavbarComponent = () => {
  return (
    <div className="fixed z-10">
      <header>
        <nav className="">
          <div className="container mx-auto py-4 flex justify-between items-center">
            <h1
              className="text-2xl font-bold text-black cursor-pointer"
              style={{ color: PINK }}
              onClick={() => Router.push("/")}
            >
              WaifuXL
            </h1>
            <div className="flex px-10 space-x-10">
              <div
                className="flex items-center space-x-2"
                onClick={() => Router.push("/about")}
              >
                <span className="text-black cursor-pointer">About</span>
              </div>
              <div
                className="flex items-center space-x-2"
                onClick={() => Router.push("/donate")}
              >
                <span className="text-black cursor-pointer">Donate</span>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavbarComponent;