from os import mkdir, path
import glob
from PIL import Image
from tqdm import tqdm

datasetPath = "/home/supa/lin_storage/Datasets/FFHQ/"
refFolder   = "1024x1024"
targetSizes = ["0512", "0256", "0128", "0064", "0032", "0016"]

refs = sorted(glob.glob(path.join(datasetPath, refFolder, "*.png")))

# Create output folders
for targetSize in targetSizes:
    outPath = path.join(datasetPath, f"{targetSize}x{targetSize}")
    mkdir(outPath)

for ref in tqdm(refs, desc="Ref Image"):
    with Image.open(ref) as refImage:
        for targetSize in tqdm(targetSizes, desc="Resizing", leave=False):
            outPath = path.join(datasetPath, f"{targetSize}x{targetSize}")
            size    = int(targetSize) 

            fname = path.basename(ref)
            oname = path.join(outPath, fname)

            resized = refImage.resize((size, size), resample=Image.LANCZOS)
            resized.save(oname)