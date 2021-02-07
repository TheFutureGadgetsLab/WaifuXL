import torch
import torch.nn as nn
import torch.nn.functional as F

class DownScale(nn.Module):
    def __init__(self, inChannels, outChannels):
        super().__init__()

        self.layers = nn.Sequential(
            nn.Conv2d(inChannels,     outChannels//2, kernel_size=4, stride=2, padding=1),
            nn.ReLU(True),
            nn.Conv2d(outChannels//2, outChannels,    kernel_size=4, stride=2, padding=1),
            nn.ReLU(True)
        )

    def forward(self, x):
        return self.layers(x)

class UpScale(nn.Module):
    def __init__(self, inChannels, outChannels, noReLU=False):
        super().__init__()

        layers = [nn.ConvTranspose2d(inChannels, outChannels, kernel_size=4, stride=2, padding=1)]
        if noReLU == False:
            layers.append(nn.ReLU(True))

        self.layers = nn.Sequential(*layers)

    def forward(self, x):
        return self.layers(x)

class ResStack(nn.Module):
    def __init__(self, nLayers, inChannels, residChannels):
        super().__init__()

        layers = [
            nn.Conv2d(inChannels, residChannels, kernel_size=1, padding=0),
            nn.ReLU(True)
        ]

        for _ in range(nLayers):
            layers.extend([
                nn.Conv2d(residChannels, residChannels, kernel_size=3, padding=1),
                nn.ReLU(True)
            ])
        
        layers.extend([
            nn.Conv2d(residChannels, inChannels, kernel_size=1, padding=0),
            nn.ReLU(True)
        ])

        self.stack = nn.Sequential(*layers)

    def forward(self, x):
        return x + self.stack(x)