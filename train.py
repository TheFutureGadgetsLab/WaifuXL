import torch
import torch.nn.functional as F
import torch.optim as optim
from model import VQ_VAE
from get_dataset import getSTL10
from os import mkdir
import torchvision.transforms as transforms
from tqdm import tqdm, trange
import torchvision
import numpy as np

torch.backends.cudnn.benchmark = True

device = torch.device(f"cuda" if torch.cuda.is_available() else "cpu")

batchSize     = 128
epochs        = 500

learning_rate = 3e-4

output_path = f"superRes/"
mkdir(output_path)

downscale = transforms.Resize((96//2, 96//2))

train_loader, test_loader = getSTL10(batchSize)

model = VQ_VAE()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

sampleFull  = next(iter(test_loader))[0][:10].to(device)
sampleSmall = downscale(sampleFull)

logPx_tot = []
MSE_tot   = []
for epoch in trange(epochs, desc="Epoch"):
    for full, _ in tqdm(train_loader, desc="Train", leave=False):
        full = full.to(device)
        down = downscale(full)

        optimizer.zero_grad()

        superScale, vqLoss = model(down)

        # Optimize model
        loss = F.mse_loss(full, superScale) + vqLoss.mean()
        loss.backward()

        optimizer.step()

    logPx_test = []
    MSE_test  = []
    for full, _ in tqdm(test_loader, desc="Test", leave=False):
        full = full.to(device)
        down = downscale(full)

        with torch.no_grad():
            superScale, vqLoss = model(down)

        optimizer.step()
        MSE_test.append(F.mse_loss(full, superScale).item())

    with torch.no_grad():
        superSample = model(sampleSmall)[0]
        torchvision.utils.save_image(torch.cat([sampleFull, superSample]).cpu(), f"{output_path}{epoch:03}.png", nrow=10)
        torch.save(model.module.state_dict(), f"{output_path}/parameters.ckpt")

    MSE_tot.append(np.mean(MSE_test))
    tqdm.write(f"logPx: {logPx_tot[-1]:.5f}\tMSE: {MSE_tot[-1]:.5f}")
