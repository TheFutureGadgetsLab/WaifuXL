"""
    The standard VQ_VAE as originally proposed (with some modifications, cos distance, one VQ loss).
    Straight through gradient estimation
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
from model.layers import UpScale, DownScale, ResStack

IM_CHANS = 3

class VQ_VAE(nn.Module):
    def __init__(self):
        super().__init__()

        self.nHiddens  = 128
        self.nRHiddens = 32
        self.nResids   = 2
        self.embedDim  = 64
        self.nEmbeds   = 256

        self.enc = nn.Sequential(
            DownScale(3, self.nHiddens),
            nn.Conv2d(self.nHiddens, self.nHiddens, kernel_size=3, padding=1),
            ResStack(self.nResids, self.nHiddens, self.nRHiddens),
            nn.Conv2d(self.nHiddens, self.embedDim, kernel_size=1, padding=0)
        )

        self.codebook = VQ_StraightThrough(self.nEmbeds, self.embedDim)

        self.dec = nn.Sequential(
            nn.Conv2d(self.embedDim, self.nHiddens, kernel_size=3, padding=1),
            ResStack(self.nResids, self.nHiddens, self.nRHiddens),
            UpScale(self.nHiddens, self.nHiddens),
            ResStack(self.nResids, self.nHiddens, self.nRHiddens),
            UpScale(self.nHiddens, 3, noReLU=True)
        )

        self.apply(weights_init)

    def forward(self, img):
        # encode the image
        z_e = self.enc(img)

        z_q, vq_loss = self.codebook(z_e)

        scaled = self.dec(z_q)
        
        return scaled, vq_loss

class VQ_StraightThrough(nn.Module):
    def __init__(self, nEmbeds, embedDim):
        super().__init__()
        self.nEmbeds = nEmbeds

        self.embedding = nn.Embedding(nEmbeds, embedDim)
        torch.nn.init.kaiming_uniform_(self.embedding.weight)

    def forward(self, z_e):
        z_e = z_e.permute(0, 2, 3, 1).contiguous()
        dists = z_e.pow(2).sum(dim=-1, keepdim=True) + (self.embedding.weight.pow(2)).sum(dim=-1) - 2*torch.matmul(z_e, self.embedding.weight.t())

        # Encoding
        inds = torch.argmin(dists, dim=-1)

        # Quantize and unflatten
        z_q = self.embedding(inds)

        # Loss
        e_latent_loss = ((z_q.detach() - z_e).pow(2)).mean(dim=(1, 2, 3))
        q_latent_loss = ((z_q - z_e.detach()).pow(2)).mean(dim=(1, 2, 3))
        vq_loss = q_latent_loss + 0.25 * e_latent_loss
        
        z_q = z_e + (z_q - z_e).detach()

        return z_q.permute(0, 3, 1, 2).contiguous(), vq_loss

def weights_init(m):
    if isinstance(m, nn.Conv2d):
        torch.nn.init.xavier_uniform_(m.weight.data)