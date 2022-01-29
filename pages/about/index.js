import { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import SideNavbar from "../../components/SideNavbar";
export default function About() {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <>
      <SideNavbar showSidebar={showSidebar} />

      <div
        className="flex flex-col items-center min-h-screen"
        style={{ backgroundImage: `url("bg.svg")`, backgroundSize: "cover" }}
      >
        <NavbarComponent currentPage="about"/>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 0 24 24"
          width="32px"
          fill="#000000"
          className="md:hidden absolute left-5 top-4 z-40 cursor-pointer"
          onClick={(e) => setShowSidebar(!showSidebar)}
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
        <a
          aria-label="Github Link"
          href="https://github.com/TheFutureGadgetsLab/WaifuXL"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="absolute right-5 top-4 z-40"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>

        <main className="flex flex-col items-center flex-shrink justify-center lg:w-5/12 p-10 text-center">
          <div className="lg:mt-20 mt-5 lg:text-6xl text-2xl">At a Glance</div>
          <div className="mt-5 lg:text-lg text-sm text-left">
            <a href="https://www.waifuxl.com" className="text-pink underline">
              WaifuXL
            </a>{" "}
            provides state of the art upscaling{" "}
            <span className="text-blue font-bold">directly</span> in your
            browser at the click of a button. No need to choose a noise level,
            no captcha, and your images are{" "}
            <span className="text-blue font-bold">never</span> sent to us.
            Everything is done locally!
          </div>
          <div className="lg:mt-20 mt-5 lg:text-6xl text-2xl">About Us</div>
          <div className="mt-5 lg:text-lg text-sm text-left">
            Hi, we’re the{" "}
            <span className="text-blue font-bold">Future Gadgets Lab</span>! We
            make a lot of random stuff, check out our organization{" "}
            <a
              className="text-pink underline"
              href="https://github.com/TheFutureGadgetsLab"
            >
              here
            </a>
            .
          </div>
          <div className="lg:mt-20 mt-5 lg:text-6xl text-2xl">In Depth</div>
          <div className="mt-5 lg:text-lg text-sm text-left">
            We send you neural networks to execute direclty in your browser
            using the{" "}
            <a href="https://onnxruntime.ai/" className="text-pink underline">
              ONNX Runtime
            </a>
            . For the upscaling model we’re using the{" "}
            <a
              href="https://arxiv.org/abs/2107.10833"
              className="text-pink underline"
            >
              SOTA Real-ESRGAN
            </a>
            . Our tagger is a{" "}
            <a
              href="https://arxiv.org/abs/1905.02244"
              className="text-pink underline"
            >
              MobileNetV3
            </a>
            . On the web side we’re using{" "}
            <a className="text-pink underline" href="https://reactjs.org/">
              React
            </a>
            ,{" "}
            <a className="text-pink underline" href="https://nextjs.org/">
              Next.js
            </a>
            , and{" "}
            <a className="text-pink underline" href="https://tailwindcss.com/">
              TailwindCSS
            </a>
            . We’re hosted on{" "}
            <a
              className="text-pink underline"
              href="https://pages.cloudflare.com/"
            >
              cloudflare pages
            </a>
            , which generously provides unlimited bandwith.
          </div>
        </main>
      </div>
    </>
  );
}
