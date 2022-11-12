import { useEffect } from 'react'
import NavbarComponent from '@/components/NavbarComponent'
import { BackgroundImage } from '@/components/SVGComponents'

export default function About() {
  useEffect(() => {
    document.body.style.overflow = 'auto'
  }, [])

  // Our resouces
  const FGLURI = <URL href="https://github.com/TheFutureGadgetsLab" text="here" after="." />
  const WXLURI = <URL href="https://www.waifuxl.com" text="Waifuxl" />
  const WRUURI = <URL href="https://haydn.fgl.dev/posts/the-launch-of-waifuxl/" text="here" after="!" />
  const ONNXURI = <URL href="https://onnxruntime.ai/" text="ONNX Runtime" after=". " />
  const MODELURI = <URL href="https://arxiv.org/abs/2107.10833" text="SOTA Real-ESRGAN" after=". " />
  const TAGGERURI = <URL href="https://arxiv.org/abs/1905.02244" text="MobileNetV3" after=". " />
  const REACTURI = <URL href="https://reactjs.org/" text="React" after=", " />
  const NJSURI = <URL href="https://nextjs.org/" text="Next.js" after=", " />
  const CFPURI = <URL href="https://pages.cloudflare.com/" text="Cloudflare Pages" after=", " />
  const TWURI = <URL href="https://tailwindcss.com/" text="TailwindCSS" after=". " />

  return (
    <>
      <NavbarComponent currentPage="about" />
      <div className="flex flex-col items-center min-h-screen">
        <main className="flex flex-col items-center flex-shrink justify-center lg:w-5/12 p-10 text-center z-50">
          <Section title="At a Glance">
            {WXLURI} provides state of the art upscaling <Bold text="directly" /> in your browser at the click of a
            button. No need to choose a noise level, no captcha, and your images are <Bold text="never" /> sent to us.
            Everything is done locally!
          </Section>
          <Section title="About Us">
            Hi, we're the <Bold text="Future Gadgets Lab" />! We make a lot of random stuff, check out our organization{' '}
            {FGLURI}
          </Section>
          <Section title="In Depth">
            <div className="text-center">Check out the full write-up {WRUURI}</div>
            <br />
            We send you neural networks to execute directly in your browser using the {ONNXURI}. For the upscaling model
            we're using the {MODELURI} Our tagger is a {TAGGERURI}
            On the web side we're using {REACTURI} {NJSURI} and {TWURI}
            We're hosted on {CFPURI} which generously provides unlimited bandwith.
          </Section>
        </main>
      </div>
      <span className="hidden md:block">
        <BackgroundImage />
      </span>
    </>
  )
}

const Section = ({ title, children }) => {
  return (
    <>
      <div className="lg:mt-20 mt-5 lg:text-6xl text-2xl">{title}</div>
      <div className="mt-5 lg:text-lg text-sm text-left">{children}</div>
    </>
  )
}

const Bold = ({ text }) => {
  return <span className="text-blue font-bold">{text}</span>
}

const URL = ({ text, href, after = ' ' }) => {
  return (
    <>
      <a className="text-pink underline" href={href} target="_blank" rel="noreferrer">
        {text}
      </a>
      {after}
    </>
  )
}
