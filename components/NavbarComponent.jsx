import { GitHubSVG } from '@/components/SVGComponents'
import Link from 'next/link'
import NewsBox from './NewsBox'
import { useAppStateStore } from '@/services/useState'

const NavbarComponent = ({ currentPage }) => {
  const styles = {
    about: currentPage === 'about' ? 'text-white' : 'text-black',
    index: currentPage === 'index' ? 'text-white' : 'text-black',
    donate: currentPage === 'donate' ? 'text-white' : 'text-black',
  }
  const mobile = useAppStateStore((state) => state.mobile)

  return (
    <>
      <GitHubSVG className="absolute right-5 bottom-4 md:top-4 z-40" />
      <header className="flex flex-col items-center relative w-full bg-pink-100 md:mb-10 z-1">
        <nav className="">
          <div className="container mx-auto md:py-4 pt-0 flex justify-between items-center gap-4">
            <Link href="/about" className={`text-3xl font-semibold ${styles.about}`}>
              About
            </Link>
            <Link href="/" className={`text-4xl font-bold ${styles.index}`}>
              WaifuXL
            </Link>
            <Link href="/donate" className={`text-3xl font-semibold ${styles.donate}`}>
              Donate
            </Link>
          </div>
        </nav>
        {currentPage === 'index' && !mobile && (
          <div className="flex flex-initial flex-row absolute left-0 top-full">
            <NewsBox />
          </div>
        )}
      </header>
    </>
  )
}

export default NavbarComponent
