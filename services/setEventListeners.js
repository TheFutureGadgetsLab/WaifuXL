import {
  getDataURIFromInput,
  setDataURIFromFile,
} from "../services/imageUtilities";

export async function setEventListeners(
  setPreviewURI,
  setFileName,
  setShowSidebar,
  setInputModalOpen
) {

  document.body.style.overflow = "hidden";
  function handleInputFile(items) {
    try {
      for (let index in items) {
        let item = items[index];
        if (item.kind === "file") {
          let file = item.getAsFile();
          setFileName(file.name.split("/").at(-1).split(".")[0]);
          setDataURIFromFile(file, setPreviewURI);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
      console.error("Unable to handle input image");
      return false;
    }
  }

  document.addEventListener("paste", async (e) => {
    let success = false;
    if (e.clipboardData.getData("text/plain")) {
      let url = e.clipboardData.getData("text/plain");
      setPreviewURI(await getDataURIFromInput(url));
      setFileName(url.split("/").at(-1).split(".")[0]);
      success = true;
    } else {
      success = handleInputFile(
        (e.clipboardData || e.originalEvent.clipboardData).items
      );
    }
    if (success) {
      setShowSidebar(true);
      setInputModalOpen(true);
    }
  });

  document.addEventListener("dragenter", (e) => {
    e.preventDefault();
  });
  document.addEventListener("drag", (e) => {
    e.preventDefault();
  });
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });
  document.addEventListener("dragend", (e) => {
    e.preventDefault();
  });
  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  document.addEventListener("drop", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let success = handleInputFile(e.dataTransfer.items);
    if (success) {
      setShowSidebar(true);
      setInputModalOpen(true);
      setFileName(e.dataTransfer.files[0].name.split("/").at(-1).split(".")[0]);
    }
  });
}
