import Link from 'next/link'

const NavbarComponent = ({ currentPage }) => {
  return (
    <header className="flex flex-col items-center relative">
      <nav className="">
        <div className="container mx-auto md:py-4 pt-0 flex justify-between items-center gap-4">
          <Link
            href="/about"
            className={`text-3xl font-semibold text-black ${currentPage === 'about' ? 'underline' : ''}`}
          >
            About
          </Link>
          <Link href="/" className={`grow text-4xl font-bold text-pink ${currentPage === 'index' ? 'underline' : ''}`}>
            WaifuXL
          </Link>
          <Link
            href="/donate"
            className={`text-3xl font-semibold text-black ${currentPage === 'donate' ? 'underline' : ''}`}
          >
            Donate
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default NavbarComponent
