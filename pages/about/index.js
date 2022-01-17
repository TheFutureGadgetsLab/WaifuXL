import NavbarComponent from "../../components/NavbarComponent";

export default function About() {
  return (
    <div
      className="flex flex-col items-center min-h-screen"
      style={{ backgroundImage: `url("bg.svg")`, backgroundSize: "cover" }}
    >
      <NavbarComponent />
      <main className="flex flex-col items-center flex-shrink justify-center w-5/12 p-10 text-center">
        <div className="mt-20 text-6xl">At a Glance</div>
        <div className="mt-5 text-lg text-left">
          <a href="https://www.waifuxl.com" className="text-pink">
            WaifuXL
          </a>{" "}
          provides state of the art upscaling{" "}
          <span className="text-blue font-bold">directly</span> in your browser
          at the click of a button. No need to choose a noise level, no captcha,
          and your images are <span className="text-blue font-bold">never</span>{" "}
          sent to us. Everything is done locally!
        </div>
        <div className="mt-20 text-6xl">About Us</div>
        <div className="mt-5 text-lg text-left">
          Hi, we’re the{" "}
          <span className="text-blue font-bold">Future Gadgets Lab</span>! We
          make a lot of random stuff, check out our organization{" "}
          <a className="text-pink" href="https://github.com/TheFutureGadgetsLab">
            here
          </a>
          .
        </div>
        <div className="mt-20 text-6xl">In Depth</div>
        <div className="mt-5 text-lg text-left">
          We send you neural networks to execute direclty in your browser using
          the{" "}
          <a
            href="https://onnxruntime.ai/"
            className="text-pink"
          >
            ONNX Runtime
          </a>
          . For the upscaling model we’re using the{" "}
          <a href="https://arxiv.org/abs/2107.10833" className="text-pink">
            SOTA Real-ESRGAN
          </a>
          . Our tagger is a{" "}
          <a href="https://arxiv.org/abs/1905.02244" className="text-pink">
            MobileNetV3
          </a>
          . On the web side we’re using{" "}
          <a className="text-pink" href="https://reactjs.org/">
            React
          </a>
          ,{" "}
          <a className="text-pink" href="https://nextjs.org/">
            Next.js
          </a>
          , and{" "}
          <a className="text-pink" href="https://tailwindcss.com/">
            TailwindCSS
          </a>
          . We’re hosted on{" "}
          <a className="text-pink" href="https://pages.cloudflare.com/">
            cloudflare pages
          </a>
          , which generously provides unlimited bandwith.
        </div>
      </main>
    </div>
  );
}
