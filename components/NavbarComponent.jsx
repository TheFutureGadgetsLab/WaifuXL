import { PINK } from "../constants/colors";
import Router from "next/router";

const NavbarComponent = () => {
  return (
    <div class="fixed">
      <header>
        <nav class="">
          <div class="container mx-auto py-4 flex justify-between items-center">
            <h1
              class="text-2xl font-bold text-black cursor-pointer"
              style={{ color: PINK }}
              onClick={() => Router.push("/")}
            >
              WaifuXL
            </h1>
            <div class="flex px-10 space-x-10">
              <div
                class="flex items-center space-x-2"
                onClick={() => Router.push("/about")}
              >
                <span class="text-black cursor-pointer">About</span>
              </div>
              <div
                class="flex items-center space-x-2"
                onClick={() => Router.push("/donate")}
              >
                <span class="text-black cursor-pointer">Donate</span>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavbarComponent;