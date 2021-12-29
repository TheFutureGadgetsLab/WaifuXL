import { useState, useEffect, createRef } from "react";
import { upScaleFromURI } from "../../services/newService";
import { initializeONNX } from "../../services/onnxBackend";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import NavbarComponent from "../../components/NavbarComponent";

export default function Home() {
  const [inputURI, setInputURI] = useState("https://i.imgur.com/yhIwVjZ.jpeg");
  const [outputURI, setOutputURI] = useState(null);
  useEffect(async () => {
    await initializeONNX();
    setOutputURI(await upScaleFromURI(inputURI));
  }, []);
  return (
    <>
      <div
        className="flex flex-col items-center min-h-screen"
        style={{ backgroundImage: `url("bg.png")`, backgroundSize: "cover" }}
      >
        <NavbarComponent />
        <div className="flex absolute w-screen h-screen items-center justify-center">
          {outputURI == null ? (
            <img src={inputURI} />
          ) : (
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={inputURI}
                  alt="Image one"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={outputURI}
                  alt="Image two"
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
}
