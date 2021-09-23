import { PINK } from "../constants/colors";

const CanvasComponent = ({
  width,
  height,
  canvasRef,
  outputCanvasRef,
  loading,
  loadingImgSrc
}) => {
  return (
    <div className="flex-grow grid grid-cols-2 justify-items-center w-full max-w-6xl">
      <canvas
        id="input"
        ref={canvasRef}
        width={width.input}
        height={height.input}
        style={{ width: 400, borderWidth: "4px", borderColor: PINK }}
      />
      <div className="relative">
        <canvas
          id="output"
          ref={outputCanvasRef}
          width={width.output}
          height={height.output}
          style={{ width: 400, borderWidth: "4px", borderColor: PINK }}
        />
        {loading &&
          <div className="flex justify-center absolute left-0 bottom-0" style={{ width: 400 }}>
            <img src={loadingImgSrc} alt="loading image" style={{ width: 200, height: 200 }} />
          </div>
        }
      </div>
    </div>
  );
};

export default CanvasComponent;
