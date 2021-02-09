import torch
import torch.nn.functional as F
import torch.optim as optim
from model import VQ_VAE
from utils import getDataset
from os import mkdir
import torchvision.transforms as transforms
from tqdm import tqdm, trange
import torchvision
import numpy as np

def main():
    torch.backends.cudnn.benchmark = True

    device = torch.device(f"cuda" if torch.cuda.is_available() else "cpu")

    batchSize     = 128
    epochs        = 500
    learning_rate = 3e-4

    output_path = f"superRes/"
    mkdir(output_path)

    train_loader, test_loader, _ = getDataset("/home/supa/lin_storage/Datasets/FFHQ/", "0032", "0064", batchSize)

    model = VQ_VAE().to(device)
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    sampleSmall, sampleFull = next(iter(test_loader))
    sampleSmall = sampleSmall[:10].to(device)
    sampleFull  = sampleFull[:10].to(device)

    MSE_tot   = []
    for epoch in trange(epochs, desc="Epoch"):
        for small, full in tqdm(train_loader, desc="Train", leave=False):
            small = small.to(device)
            full  = full.to(device)

            optimizer.zero_grad()

            superScale, vqLoss = model(small)

            # Optimize model
            loss = F.mse_loss(full, superScale, reduction='none').mean(dim=(1, 2, 3)) + vqLoss
            loss.mean().backward()

            optimizer.step()

        MSE_test  = []
        for small, full in tqdm(test_loader, desc="Test", leave=False):
            small = small.to(device)
            full  = full.to(device)

            with torch.no_grad():
                superScale, vqLoss = model(small)

                MSE_test.append(F.mse_loss(full, superScale).item())

        with torch.no_grad():
            superSample = model(sampleSmall)[0]
            torchvision.utils.save_image(torch.cat([sampleFull, superSample]).cpu(), f"{output_path}{epoch:03}.png", nrow=10)
            torch.save(model.state_dict(), f"{output_path}/parameters.ckpt")

        MSE_tot.append(np.mean(MSE_test))
        tqdm.write(f"MSE: {MSE_tot[-1]:.5f}")

if __name__ == "__main__":
    main()