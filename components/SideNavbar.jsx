import Router from "next/router";

const SideNavbar = ({
  showSidebar,
  currentPage,
}) => {
  return (
    <div
      id="sidebar"
      className={`md:hidden w-80 flex flex-col fixed inset-y-0 ${
        showSidebar ? "" : "hidden"
      }`}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="">
            <div className="pt-5 mt-10 mb-10 mx-8 space-y-2 grid grid-cols-1">
            <div
                className="md:hidden flex items-center space-x-2"
                onClick={() => Router.push("./")}
              >
                <span className={`text-2xl font-semibold text-black cursor-pointer ${currentPage === "index" ? 'underline' : ''}`}>
                  Home
                </span>
              </div>

              <div
                className="md:hidden flex items-center space-x-2"
                onClick={() => Router.push("./about")}
              >
                <span className={`text-2xl font-semibold text-black cursor-pointer ${currentPage === "about" ? 'underline' : ''}`}>
                  About
                </span>
              </div>
              <div
                className="md:hidden flex items-center space-x-2"
                onClick={() => Router.push("./donate")}
              >
                <span className={`text-2xl font-semibold text-black cursor-pointer ${currentPage === "donate" ? 'underline' : ''}`}>
                  Donate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
