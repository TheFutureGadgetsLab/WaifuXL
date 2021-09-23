import { BLUE } from "../constants/colors";
import { getImageFromFileUpload } from "../services/imageUtilities";

const InputComponent = ({
  canvasContext,
  setHeight,
  setWidth,
  setOutHeight,
  setOutWidth,
  url,
  setShowDownloads,
  setUrl,
}) => {
  return (
    <>
      <input
        type="file"
        onChange={(e) => {
          getImageFromFileUpload(
            e.target.files[0],
            canvasContext,
            setHeight,
            setWidth,
            setOutHeight,
            setOutWidth
          );
          setShowDownloads(false);
        }}
      />
      <input
        className="bg-gray-200 shadow-inner rounded-l"
        id="image-url"
        placeholder={url}
        onBlur={(inp) => {
          setUrl(inp.target.value);
        }}
        list="defaultOptions"
      />
      <datalist id="defaultOptions">
        <option value="https://i.imgur.com/v9Lwral.png">
          Megumin (Literally a child)
        </option>
        <option value="https://i.imgur.com/yhIwVjZ.jpeg">
          Aqua (Best Girl)
        </option>
        <option value="https://i.imgur.com/9MQHsx8.jpeg">
          Darkness (Worst Girl)
        </option>
        <option value="https://i.imgur.com/Sf6sfPj.png">
          Ozen (Best Girl)
        </option>
      </datalist>
    </>
  );
};

export default InputComponent;
