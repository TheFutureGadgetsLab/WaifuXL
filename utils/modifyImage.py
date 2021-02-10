from PIL import Image

def centerAndCropImage(targetDimensions,path,outPath):
    im = Image.open(path)

    width, height = im.size

    print(width,height)

    widthDiff = width - targetDimensions[0]
    heightDiff = height - targetDimensions[1]

    center = (int(width/2),int(height/2))

    newLeft = widthDiff/2
    newRight = width-(widthDiff/2)
    newTop = heightDiff/2
    newBottom = height-(heightDiff/2) 

    im1 = im.crop((newLeft,newTop,newRight,newBottom))
    im1.save(f"../images/{path.split('/')[-1].split('.')[0]}_cropped.png","PNG")

centerAndCropImage((500,500),"../images/sampleOne.png","../images/")