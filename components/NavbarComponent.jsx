import Router from "next/router";

const NavbarComponent = () => {
  return (
    <div className="">
      <header>
        <nav className="">
          <div className="md:pl-4 container mx-auto py-4 flex justify-between items-center">
            <div className="flex px-10 space-x-10">
              <div
                className="md:flex md:items-center md:space-x-2 hidden"
                onClick={() => Router.push("./about")}
              >
                <span className="text-2xl font-semibold text-black cursor-pointer">
                  About
                </span>
              </div>
              <div
                className="text-3xl font-bold cursor-pointer text-pink md:pl-4 pr-4"
                onClick={() => Router.push("./")}
              >
                WaifuXL
              </div>

              <div
                className="md:flex md:items-center md:space-x-2 hidden"
                onClick={() => Router.push("./donate")}
              >
                <span className="text-2xl font-semibold text-black cursor-pointer">
                  Donate
                </span>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavbarComponent;
