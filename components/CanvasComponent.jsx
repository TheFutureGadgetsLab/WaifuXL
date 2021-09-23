import { PINK } from "../constants/colors";

const CanvasComponent = ({
  width,
  height,
  outWidth,
  outHeight,
  canvasRef,
  outputCanvasRef,
}) => {
  return (
    <div className="flex-grow grid grid-cols-2 justify-items-center w-full max-w-6xl">
      <canvas
        id="input"
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: 400, borderWidth: "4px", borderColor: PINK }}
      />
      <div>
        <canvas
          id="output"
          ref={outputCanvasRef}
          width={outWidth}
          height={outHeight}
          style={{ width: 400, borderWidth: "4px", borderColor: PINK }}
        />
      </div>
    </div>
  );
};

export default CanvasComponent;
