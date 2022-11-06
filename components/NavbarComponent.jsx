import Link from 'next/link'

const NavbarComponent = ({ currentPage }) => {
  return (
    <div className="flex flex-col items-center relative">
      <header>
        <nav className="">
          <div className="container mx-auto py-4 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="grow flex items-center">
                <Link
                  href="/about"
                  className={`text-2xl font-semibold text-black cursor-pointer ${
                    currentPage === 'about' ? 'underline' : ''
                  }`}
                >
                  About
                </Link>
              </div>
              <Link
                href="/"
                className={`grow text-3xl font-bold cursor-pointer text-pink ${
                  currentPage === 'index' ? 'underline' : ''
                }`}
              >
                WaifuXL
              </Link>
              <Link
                href="/donate"
                className={`text-2xl font-semibold text-black cursor-pointer ${
                  currentPage === 'about' ? 'underline' : ''
                }`}
              >
                Donate
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default NavbarComponent
