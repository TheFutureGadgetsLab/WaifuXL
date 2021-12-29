import { useState, useEffect, createRef } from "react";
import { getDataURIFromInput, upScaleFromURI } from "../../services/newService";
import { initializeONNX } from "../../services/onnxBackend";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import NavbarComponent from "../../components/NavbarComponent";
import TitleComponent from "../../components/TitleComponent";
import DownloadComponent from "../../components/DownloadRewrite";
export default function Home() {
  const [inputURI, setInputURI] = useState("https://i.imgur.com/yhIwVjZ.jpeg");
  const [outputURI, setOutputURI] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setInputURI(await getDataURIFromInput("https://i.imgur.com/yhIwVjZ.jpeg"));
    await initializeONNX();
    setOutputURI(await upScaleFromURI(inputURI, setLoading));
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
            <img
              src={inputURI}
              className={"border-pink"}
              style={{
                width: 500,
                borderWidth: "4px",
                backgroundColor: "white",
              }}
            />
          ) : (
            <ReactCompareSlider
              className={"border-pink"}
              style={{
                width: 500,
                borderWidth: "4px",
                backgroundColor: "white",
              }}
              itemOne={
                <ReactCompareSliderImage src={inputURI} alt="Image one" />
              }
              itemTwo={
                <ReactCompareSliderImage src={outputURI} alt="Image two" />
              }
            />
          )}
        </div>
        <div className="absolute bottom-0">
          {outputURI != null && (
            <DownloadComponent
              inputURI={inputURI}
              outputURI={outputURI}
            />
          )}

          <TitleComponent loading={loading} />
        </div>
      </div>
    </>
  );
}
