import { PINK } from "../constants/colors";
import { useEffect } from "react";

const CanvasComponent = ({
  width,
  height,
  canvasRef,
  outputCanvasRef,
  loading,
  loadingImgSrc
}) => {
  const [style, setStyle] = useState({ width: 500, borderWidth: "4px", borderColor: PINK });
  useEffect(() => {
    setStyle({ width: 500, borderWidth: "4px", borderColor: PINK });
  });

  return (
    <div className="flex-grow grid grid-cols-2 justify-items-stretch w-full">
      <canvas className="justify-self-end mr-3"
        id="input"
        ref={canvasRef}
        width={width.input}
        height={height.input}
        style={style}
      />
      <div className="relative">
        <canvas className="justify-self-start ml-3"
          id="output"
          ref={outputCanvasRef}
          width={width.output}
          height={height.output}
          style={style}
        />
        {loading &&
          <div className="flex justify-center absolute left-0 bottom-0" style={{ width: 400 }}>
            <img src={loadingImgSrc} alt="loading image" style={{ width: 400, height: 400, marginBottom: 4 }} />
          </div>
        }
      </div>
    </div>
  );
};

export default CanvasComponent;
