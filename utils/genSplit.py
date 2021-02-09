from os import listdir
import numpy as np

# Train, test, val percents
splitSizes = [0.70, 0.15, 0.15]

basePath = "/home/supa/lin_storage/Datasets/FFHQ/1024x1024/"
outPath  = "/home/supa/lin_storage/Datasets/FFHQ/"

files  = [f for f in listdir(basePath) if ".png" in f]
nFiles = len(files) 
np.random.shuffle(files)

trainSize = int(splitSizes[0] * nFiles)
testSize  = trainSize + int(splitSizes[1] * nFiles)

train, test, val = np.split(files, [trainSize, testSize])

assert (len(train) + len(test) + len(val)) == nFiles

np.savetxt(f"{outPath}train.txt", train, fmt="%s")
np.savetxt(f"{outPath}test.txt",  test,  fmt="%s")
np.savetxt(f"{outPath}val.txt",   val,   fmt="%s")