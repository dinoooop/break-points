import type { Crop } from "react-image-crop";

/**
 * Crops an image based on the given crop data and returns a base64 JPEG.
 * Works with % or px crop values from react-image-crop.
 */
export async function getCroppedImage(imageSrc: string, crop: Crop): Promise<string> {
  if (!crop || !crop.width || !crop.height) {
    throw new Error("Invalid crop dimensions");
  }

  const image = new Image();
  image.crossOrigin = "anonymous"; // Important if using remote images
  image.src = imageSrc;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  // Ensure correct scale based on image's natural dimensions
  // const scaleX = image.naturalWidth / image.width;
  // const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio || 1;

  // Handle % units from ReactCrop (convert to px)
  const cropX = crop.unit === "%" ? (crop.x / 100) * image.naturalWidth : crop.x;
  const cropY = crop.unit === "%" ? (crop.y / 100) * image.naturalHeight : crop.y;
  const cropW = crop.unit === "%" ? (crop.width / 100) * image.naturalWidth : crop.width;
  const cropH = crop.unit === "%" ? (crop.height / 100) * image.naturalHeight : crop.height;

  const canvas = document.createElement("canvas");
  canvas.width = cropW * pixelRatio;
  canvas.height = cropH * pixelRatio;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  );

  return canvas.toDataURL("image/jpeg");
}