from torchvision import transforms
from torch.utils.data import Dataset, DataLoader
from os import path
import numpy as np
from PIL import Image

def getDataset(root, smallRes, largeRes, batchSize, numWorkers=2):
    train = DataLoader(ScaledDataset(root, "train.txt", smallRes, largeRes), batch_size=batchSize, shuffle=True, pin_memory=True, num_workers=numWorkers)
    test  = DataLoader(ScaledDataset(root, "test.txt", smallRes, largeRes),  batch_size=batchSize, shuffle=True, pin_memory=True, num_workers=numWorkers)
    val   = DataLoader(ScaledDataset(root, "val.txt", smallRes, largeRes),   batch_size=batchSize, shuffle=True, pin_memory=True, num_workers=numWorkers)

    return train, test, val

class ScaledDataset(Dataset):
    def __init__(self, root, splitFile, smallRes, largeRes) -> None:
        super().__init__()

        self.root      = root
        self.splitFile = splitFile

        self.smallRes  = smallRes
        self.largeRes  = largeRes

        self.files = np.loadtxt(path.join(root, splitFile), dtype=str)

        self.smallFiles = [path.join(root, f"{smallRes}x{smallRes}", name) for name in self.files]
        self.largeFiles = [path.join(root, f"{largeRes}x{largeRes}", name) for name in self.files]

        self.nFiles = len(self.files)

        self.toTensor = transforms.ToTensor()

        self.imCache = {}

    def __len__(self):
        return self.nFiles
    
    def __getitem__(self, idx):
        if idx in self.imCache:
            return self.imCache[idx]

        small = Image.open(self.smallFiles[idx])
        large = Image.open(self.largeFiles[idx])

        small = self.toTensor(small)
        large = self.toTensor(large)

        self.imCache[idx] = (small, large)

        return self.imCache[idx]