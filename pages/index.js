import { useState, useEffect } from "react";
import { getDataURIFromInput } from "../services/imageUtilities";
import { initializeONNX } from "../services/onnxBackend";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import NavbarComponent from "../components/NavbarComponent";
import TitleComponent from "../components/TitleComponent";
import DownloadComponent from "../components/DownloadComponent";
import RunComponent from "../components/RunComponent";
import InputComponent from "../components/InputComponent";

export default function Home() {
  const [inputURI, setInputURI] = useState("https://i.imgur.com/Sf6sfPj.png");
  const [outputURI, setOutputURI] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);

  useEffect(async () => {
    await initializeONNX();
    //note: this is the input logic (given some from of URI)
    setInputURI(await getDataURIFromInput(inputURI));
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
                height: 500,
                borderWidth: "4px",
                backgroundColor: "white",
              }}
            />
          ) : (
            <ReactCompareSlider
              className={"border-pink"}
              style={{
                height: 500,
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
            <DownloadComponent inputURI={inputURI} outputURI={outputURI} />
          )}

          <TitleComponent loading={loading} />
          <div className="grid grid-cols-2 gap-3 py-2 px-4">
            <InputComponent
              inputModalOpen={inputModalOpen}
              setInputModalOpen={setInputModalOpen}
              setInputURI={setInputURI}
              setOutputURI={setOutputURI}
            />
            <RunComponent
              setLoading={setLoading}
              inputURI={inputURI}
              setOutputURI={setOutputURI}
            />
          </div>
        </div>
      </div>
    </>
  );
}
