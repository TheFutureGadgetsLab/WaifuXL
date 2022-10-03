import { useEffect } from 'react'
import NavbarComponent from '../../components/NavbarComponent'
import { GitHubSVG, KizunaBG } from '../../components/SVGComponents'

export default function About() {
  useEffect(() => {
    document.body.style.overflow = 'auto'
  }, [])

  return (
    <>
      <KizunaBG />
      <div className="flex flex-col items-center min-h-screen">
        <NavbarComponent currentPage="about" />
        <GitHubSVG className="absolute right-5 top-4 z-40" />
        <main className="flex flex-col items-center flex-shrink justify-center lg:w-5/12 p-10 text-center">
          <div className="lg:mt-20 mt-5 lg:text-6xl text-2xl">At a Glance</div>
          <div className="mt-5 lg:text-lg text-sm text-left">
            <a href="https://www.waifuxl.com" className="text-pink underline">
              WaifuXL
            </a>{' '}
            provides state of the art upscaling <span className="text-blue font-bold">directly</span> in your browser at
            the click of a button. No need to choose a noise level, no captcha, and your images are{' '}
            <span className="text-blue font-bold">never</span> sent to us. Everything is done locally!
          </div>
          <div className="lg:mt-20 mt-5 lg:text-6xl text-2xl">About Us</div>
          <div className="mt-5 lg:text-lg text-sm text-left">
            Hi, we're the <span className="text-blue font-bold">Future Gadgets Lab</span>! We make a lot of random
            stuff, check out our organization{' '}
            <a
              className="text-pink underline"
              href="https://github.com/TheFutureGadgetsLab"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </div>
          <div className="lg:mt-20 mt-5 lg:text-6xl text-2xl">In Depth</div>
          <div className="mt-5 lg:text-lg text-sm text-left">
            <div className="text-center">
              Check out the full write-up{' '}
              <a
                className="text-pink underline"
                href="https://haydn.fgl.dev/posts/the-launch-of-waifuxl/"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              !
            </div>
            <br />
            We send you neural networks to execute directly in your browser using the{' '}
            <a href="https://onnxruntime.ai/" className="text-pink underline" target="_blank" rel="noreferrer">
              ONNX Runtime
            </a>
            . For the upscaling model we're using the{' '}
            <a href="https://arxiv.org/abs/2107.10833" className="text-pink underline" target="_blank" rel="noreferrer">
              SOTA Real-ESRGAN
            </a>
            . Our tagger is a{' '}
            <a href="https://arxiv.org/abs/1905.02244" className="text-pink underline" target="_blank" rel="noreferrer">
              MobileNetV3
            </a>
            . On the web side we're using{' '}
            <a className="text-pink underline" href="https://reactjs.org/" target="_blank" rel="noreferrer">
              React
            </a>
            ,{' '}
            <a className="text-pink underline" href="https://nextjs.org/" target="_blank" rel="noreferrer">
              Next.js
            </a>
            , and{' '}
            <a className="text-pink underline" href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
              TailwindCSS
            </a>
            . We're hosted on{' '}
            <a className="text-pink underline" href="https://pages.cloudflare.com/" target="_blank" rel="noreferrer">
              cloudflare pages
            </a>
            , which generously provides unlimited bandwith.
          </div>
        </main>
      </div>
    </>
  )
}
