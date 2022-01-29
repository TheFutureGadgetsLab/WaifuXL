import Router from "next/router";

const NavbarComponent = ({currentPage}) => {
  return (
    <div className="">
      <header>
        <nav className="">
          <div className="container mx-auto py-4 flex justify-between items-center">
            <div className="flex px-10 gap-4">
              <div className="grow md:flex md:items-center hidden">
                <a
                  href="/about"
                  className={`text-2xl font-semibold text-black cursor-pointer ${currentPage === "about" ? 'underline' : ''}`}
                >
                  About
                </a>
              </div>
              <div className={`grow text-3xl font-bold cursor-pointer text-pink`}>
                <a className={`${currentPage === "index" ? 'underline' : ''}`} href="/">WaifuXL</a>
              </div>

              <div className="grow md:flex md:items-center hidden">
                <a
                  href="/donate"
                  className={`text-2xl font-semibold text-black cursor-pointer ${currentPage === "donate" ? 'underline' : ''}`}
                >
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
