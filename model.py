"""
    The standard VQ_VAE as originally proposed (with some modifications, cos distance, one VQ loss).
    Straight through gradient estimation
"""
import torch
import torch.nn as nn
from layers import UpScale, DownScale, ResStack

IM_CHANS = 3

class VQ_VAE(nn.Module):
    def __init__(self):
        super().__init__()

        self.nHiddens = 128
        self.nResids  = 3
        self.embedDim = 64
        self.nEmbeds  = 256

        self.enc = nn.Sequential(
            DownScale(3, self.nHiddens),
            ResStack(self.nResids, self.nHiddens, self.nHiddens // 2),
            nn.ReLU(),
            nn.Conv2d(self.nHiddens, self.embedDim, kernel_size=1, padding=0)
        )

        self.codebook = VQ_StraightThrough(self.nEmbeds, self.embedDim)

        self.dec = nn.Sequential(
            ResStack(self.nResids, self.embedDim, self.nHiddens),
            nn.ReLU(),
            UpScale(self.nHiddens // 2, self.nHiddens),
            nn.Conv2d(self.nHiddens, self.nHiddens, kernel_size=3, padding=1),
            nn.ReLU(),
            UpScale(self.nHiddens, self.nHiddens),
            nn.Conv2d(self.nHiddens, self.nHiddens, kernel_size=3, padding=1),
            nn.ReLU(),
            UpScale(self.nHiddens, self.nHiddens),
            nn.Conv2d(self.nHiddens, self.nHiddens, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(self.nHiddens, self.nHiddens, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(self.nHiddens, 3, kernel_size=3, padding=1),
        )

    def forward(self, img):
        # encode the image
        z_e = self.enc(img)

        z_q, vq_loss = self.codebook(z_e)

        scaled = self.dec(z_q)
        
        return scaled, vq_loss

class VQ_StraightThrough(nn.Module):
    def __init__(self, nEmbeds, embedDim):
        super().__init__()

        self.embedding = nn.Embedding(nEmbeds, embedDim)
        torch.nn.init.kaiming_uniform_(self.embedding.weight)

    def forward(self, z_e):
        z_e = z_e.permute(0, 2, 3, 1)
        dists = z_e.square().sum(dim=-1, keepdim=True) + (self.embedding.weight.square()).sum(dim=-1) - 2*torch.matmul(z_e, self.embedding.weight.t())

        # Encoding
        inds = torch.argmin(dists, dim=-1, keepdim=True)

        sample = torch.zeros_like(dists)
        sample.scatter_(-1, inds, 1)
        
        # Quantize and unflatten
        z_q = torch.matmul(sample, self.embedding.weight)

        # Loss
        q_latent_loss = ((z_e.detach() - z_q) ** 2).mean(dim=(1, 2, 3))
        e_latent_loss = ((z_e - z_q.detach()) ** 2).mean(dim=(1, 2, 3))
        vq_loss = q_latent_loss + 0.25 * e_latent_loss
        
        z_q = z_e + (z_q - z_e).detach()

        return z_q.movedim(-1, 1).contiguous(), vq_loss

net = VQ_VAE()
a = torch.randn((1, 3, 128, 128))