from pathlib import Path
from glob import glob
from torch.utils.data import Dataset
import torchvision as tv

class ImageFolder(Dataset):
    def __init__(self, root: str):
        self.root = Path(root).resolve()

        self.files = []
        self.find_images()

    def find_images(self):
        for ext in ["*.jpg", "*.png", "*.jpeg"]:
            glob_targ = str(self.root / "**" / ext)
            self.files.extend(glob(glob_targ, recursive=True))

    def __getitem__(self, index):
        return tv.io.read_image(self.files[index]), self.files[index]

    def __len__(self):
        return len(self.files)

    def __repr__(self) -> str:
        return f"ImageFolder\n\tRoot: {self.root}\n\tSamples: {len(self)}"