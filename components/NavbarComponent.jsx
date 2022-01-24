import Router from "next/router";

const NavbarComponent = () => {
  return (
    <div className="">
      <header>
        <nav className="">
          <div className="container mx-auto py-4 flex justify-between items-center">
            <div className="flex px-10 gap-4">
              <div className="grow md:flex md:items-center hidden">
                <a
                  href="/about"
                  className="text-2xl font-semibold text-black cursor-pointer"
                >
                  About
                </a>
              </div>
              <div className="grow text-3xl font-bold cursor-pointer text-pink">
                <a href="/">WaifuXL</a>
              </div>

              <div
                className="grow md:flex md:items-center hidden"
                onClick={() => Router.push("./donate")}
              >
                <a href="/donate" className="text-2xl font-semibold text-black cursor-pointer">
                  Donate
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavbarComponent;
