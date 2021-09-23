import { PINK } from "../constants/colors";

const CanvasComponent = ({
  width,
  height,
  canvasRef,
  outputCanvasRef,
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
      <div>
        <canvas
          id="output"
          ref={outputCanvasRef}
          width={width.output}
          height={height.output}
          style={{ width: 400, borderWidth: "4px", borderColor: PINK }}
        />
      </div>
    </div>
  );
};

export default CanvasComponent;
