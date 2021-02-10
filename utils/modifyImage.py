from PIL import Image

def centerAndCropImage(targetDimensions,path,outPath):
    fileName = path.split('/')[-1].split('.')[0]
    fileExtension = path.split(".")[-1]
    if fileExtension == "png":
        outFlag = "PNG"
    #note that I haven't tested this on a jpg file
    elif fileExtension == "jpeg" or fileExtension == "jpg":
        outFlag = "JPEG"
    else:
        raise Exception("Unknown File Type")
    
    im = Image.open(path)

    width, height = im.size

    widthDiff = width - targetDimensions[0]
    heightDiff = height - targetDimensions[1]

    newLeft = widthDiff/2
    newRight = width-(widthDiff/2)
    newTop = heightDiff/2
    newBottom = height-(heightDiff/2) 

    im1 = im.crop((newLeft,newTop,newRight,newBottom))
    im1.save(f"../images/{fileName}_cropped.{fileExtension}",outFlag)

centerAndCropImage((500,500),"../images/sampleOne.png","../images/")