import torch
import torch.nn.functional as F
from torch import Tensor
from torch import nn as nn


class RealESRGANWrapper(nn.Module):
    def __init__(self,
        device: torch.device = torch.device("cpu"),
        jit: bool = True,
        dtype: torch.dtype = torch.float16,
        channel_last: bool = True
    ):
        """
        SISR model based on Real-ESRGAN

        Parameters
        ----------
        device: torch.device
            Device to run the model on (cpu / cuda), (default: cpu)
        jit: bool
            Whether to use TorchScript on the model. Increases performance (default: True)
        dtype: torch.dtype
            Data type to use for the model (default: torch.float16)
        channel_last: bool
            Whether to use channel last memory layout. Increases performance (default: True)
        """
        super().__init__()

        self.model = RRDBNet(in_ch=3, out_ch=3, num_feat=64, num_block=6, num_grow_ch=32, scale=2)
        self.load_state_dict(torch.load("./data/superRes.ckpt"), strict=True)

        self.model = self.model.to(device, dtype=dtype)

        if jit:
            self.model = torch.jit.script(self.model)

        if channel_last:
            self.model = self.model.to(memory_format=torch.channels_last)

        self.device = device
        self.dtype = dtype
        self.freeze()

    @torch.inference_mode()
    def forward(self, lr: Tensor) -> Tensor:
        """
        Forward pass of the model

        Parameters
        ----------
        lr: Tensor
            Low resolution image tensor, shape: (batch_size, 3, height, width)

        Returns
        -------
        Tensor
            High resolution image tensor, shape: (batch_size, 3, height * 2, width * 2)
        """
        lr = lr.to(device=self.device, dtype=self.dtype)
        lr = self.preproc(lr)

        sr = self.model(lr)
        sr = self.postproc(sr)

        return sr.cpu()

    def postproc(self, x: Tensor) -> Tensor:
        x = x.clamp_(0, 1).mul_(255).int()
        return x

    def preproc(self, x: Tensor) -> Tensor:
        x.div_(255.0)

        # pad to even height / width
        x = F.pad(x, (0, x.shape[-1]%2, 0, x.shape[-2]%2), mode='replicate')
        return x

    def freeze(self):
        for param in self.model.parameters():
            param.requires_grad = False
        self.eval()


class RRDBNet(nn.Module):
    """
        Architecture used in Real-ESRGAN
        https://arxiv.org/abs/2107.10833
    """
    def __init__(self, in_ch: int, out_ch: int, scale: int=4, num_feat: int=64, num_block: int=23, num_grow_ch: int=32):
        super().__init__()

        if scale == 2:
            in_ch = in_ch * 4
        elif scale == 1:
            in_ch = in_ch * 16

        self.in_conv = nn.Sequential(
            nn.PixelUnshuffle(downscale_factor={1: 4, 2: 2}[scale]),
            nn.Conv2d(in_ch, num_feat, 3, 1, 1)
        )

        self.body = nn.Sequential(
            *[RRDB(num_feat, num_grow_ch) for _ in range(num_block)],
            nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        )

        self.head = nn.Sequential(
            nn.Upsample(scale_factor=2, mode='nearest'),
            nn.Conv2d(num_feat, num_feat, kernel_size=3, padding=1),
            nn.LeakyReLU(negative_slope=0.2, inplace=True),

            nn.Upsample(scale_factor=2, mode='nearest'),
            nn.Conv2d(num_feat, num_feat, kernel_size=3, padding=1),
            nn.LeakyReLU(negative_slope=0.2, inplace=True),

            nn.Conv2d(num_feat, num_feat, kernel_size=3, padding=1),
            nn.LeakyReLU(negative_slope=0.2, inplace=True),
            nn.Conv2d(num_feat, out_ch,  kernel_size=3, padding=1)
        )

    def forward(self, x: Tensor) -> Tensor:
        feat = self.in_conv(x)

        body_feat = self.body(feat)
        feat = feat + body_feat

        out = self.head(feat)

        return out

class RRDB(nn.Module):
    def __init__(self, num_feat: int, num_grow_ch: int=32):
        super().__init__()

        self.layers = nn.Sequential(
            RDB(num_feat, num_grow_ch),
            RDB(num_feat, num_grow_ch),
            RDB(num_feat, num_grow_ch),
        )

    def forward(self, x: Tensor) -> Tensor:
        out = self.layers(x)
        return out * 0.2 + x

class RDB(nn.Module):
    def __init__(self, num_feat: int=64, num_grow_ch: int=32):
        super().__init__()

        self.layers = nn.Sequential(
            GrowBlock(num_feat + 0 * num_grow_ch, num_grow_ch),
            GrowBlock(num_feat + 1 * num_grow_ch, num_grow_ch),
            GrowBlock(num_feat + 2 * num_grow_ch, num_grow_ch),
            GrowBlock(num_feat + 3 * num_grow_ch, num_grow_ch),
            nn.Conv2d(num_feat + 4 * num_grow_ch, num_feat, kernel_size=3, padding=1),
        )

    def forward(self, x: Tensor) -> Tensor:
        x5 = self.layers(x)
        return x5 * 0.2 + x

class GrowBlock(nn.Module):
    def __init__(self, nin: int, nout: int):
        super().__init__()

        self.layers = nn.Sequential(
            nn.Conv2d(in_channels=nin, out_channels=nout, kernel_size=3, padding=1),
            nn.LeakyReLU(negative_slope=0.2, inplace=True),
        )

    def forward(self, x: Tensor) -> Tensor:
        xhat = self.layers(x)
        return torch.cat((x, xhat), 1)
