import Link from 'next/link'
import { GitHubSVG } from '@/components/SVGComponents'

const NavbarComponent = ({ currentPage }) => {
  const about_style = currentPage === 'about' ? 'text-white' : 'text-black'
  const index_style = currentPage === 'index' ? 'text-white' : 'text-black'
  const donate_style = currentPage === 'donate' ? 'text-white' : 'text-black'
  return (
    <>
      <GitHubSVG className="absolute right-5 bottom-4 md:top-4 z-40" />
      <header className="flex flex-col items-center relative w-full bg-pink md:mb-10">
        <nav className="">
          <div className="container mx-auto md:py-4 pt-0 flex justify-between items-center gap-4">
            <Link href="/about" className={`text-3xl font-semibold ${about_style}`}>
              About
            </Link>
            <Link href="/" className={`text-4xl font-bold text-pink ${index_style}`}>
              WaifuXL
            </Link>
            <Link href="/donate" className={`text-3xl font-semibold ${donate_style}`}>
              Donate
            </Link>
          </div>
        </nav>
      </header>
    </>
  )
}

export default NavbarComponent
