import Router from "next/router";

const NavbarComponent = () => {
  return (
    <div className="fixed">
      <header>
        <nav className="">
          <div className="pl-4 container mx-auto py-4 flex justify-between items-center">
            <div className="flex px-10 space-x-10">
              <div
                className="flex items-center space-x-2"
                onClick={() => Router.push("./about")}
              >
                <span className="text-2xl font-semibold text-black cursor-pointer">
                  About
                </span>
              </div>
              <div
                className="text-3xl font-bold cursor-pointer text-pink"
                onClick={() => Router.push("./")}
              >
                WaifuXL
              </div>

              <div
                className="flex items-center space-x-2"
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
