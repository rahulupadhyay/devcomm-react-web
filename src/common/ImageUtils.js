// A few JavaScript Functions for Images and Files

// Convert a Base64-encoded string to a File object
export const base64StringtoFile = (base64String, filename) => {
    let arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {type: mime});
};

// Download a Base64-encoded file

export const downloadBase64File = (base64Data, filename) => {
    let element = document.createElement('a');
    element.setAttribute('href', base64Data);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

// Extract an Base64 Image's File Extension
export const extractImageFileExtensionFromBase64 = (base64Data) => {
    return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'));
};

// Base64 Image to Canvas with a Crop
export const image64toCanvasRef = (canvasRef, image64, pixelCrop) => {
    const canvas = canvasRef;// document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.imgSrc = image64;
    image.onload = function () {
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        )
    }
};