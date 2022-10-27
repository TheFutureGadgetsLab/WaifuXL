// USE NEXTJS LINKS FOR NAVIGATION

const NavbarComponent = ({ currentPage }) => {
  return (
    <div className="flex flex-col items-center relative">
      <header>
        <nav className="">
          <div className="container mx-auto py-4 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="grow flex items-center">
                <a
                  href="/about"
                  className={`text-2xl font-semibold text-black cursor-pointer ${
                    currentPage === 'about' ? 'underline' : ''
                  }`}
                >
                  About
                </a>
              </div>
              <div className="grow text-3xl font-bold cursor-pointer text-pink">
                <a className={`${currentPage === 'index' ? 'underline' : ''}`} href="/">
                  WaifuXL
                </a>
              </div>

              <div className="grow flex items-center">
                <a
                  href="/donate"
                  className={`text-2xl font-semibold text-black cursor-pointer ${
                    currentPage === 'donate' ? 'underline' : ''
                  }`}
                >
                  Donate
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default NavbarComponent
