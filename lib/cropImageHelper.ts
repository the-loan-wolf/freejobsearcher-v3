// cropImageHelper.ts

import { Area } from "react-easy-crop";

/**
 * Crops an image based on the provided area and optimizes it for file size.
 * * @param imageSrc The data URL of the source image.
 * @param pixelCrop The crop area in pixels from react-easy-crop.
 * @param quality The JPEG compression quality (0.0 to 1.0). Default is 0.8.
 * @returns A Promise that resolves with the optimized File object.
 */
export default function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  quality: number = 0.8
): Promise<File> {

  // Define maximum dimensions for the output image (e.g., 500x500 for a profile pic)
  const MAX_DIMENSION = 500;

  return new Promise<File>((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      // Determine the actual dimensions of the cropped area
      const croppedWidth = pixelCrop.width;
      const croppedHeight = pixelCrop.height;

      // Determine the scale factor to fit within MAX_DIMENSION while preserving aspect ratio
      let scaleX = 1;
      let scaleY = 1;

      if (croppedWidth > MAX_DIMENSION) {
        scaleX = MAX_DIMENSION / croppedWidth;
      }
      if (croppedHeight > MAX_DIMENSION) {
        scaleY = MAX_DIMENSION / croppedHeight;
      }

      // Use the smaller scale factor to ensure both dimensions fit
      const scale = Math.min(scaleX, scaleY);

      // Calculate the final canvas size after optional downscaling
      const finalWidth = croppedWidth * scale;
      const finalHeight = croppedHeight * scale;

      const canvas = document.createElement("canvas");
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return reject(new Error("Failed to get 2D context"));
      }

      // 1. Draw the image onto the canvas, cropping the source area
      // 2. Scale the image as it's drawn to the destination rectangle (0, 0, finalWidth, finalHeight)
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        croppedWidth,
        croppedHeight,
        0,
        0,
        finalWidth,
        finalHeight // Destination width and height are scaled down
      );

      // --- File Size Reduction Step ---
      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error("Canvas is empty after toBlob conversion"));
        }

        // Check if the blob is already small enough (optional logging for debugging)
        // console.log(`Final Blob Size: ${blob.size / 1024} KB`);

        const randomStr = Math.random().toString(36).substring(2, 10);
        const fileName = `profilepic_${randomStr}.jpeg`;

        // The File constructor expects a Blob, which now contains the compressed data
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve(file);

      }, "image/jpeg", quality); // <--- Quality parameter reduces file size (e.g., 0.8)
    };

    image.onerror = () => reject(new Error("Failed to load image"));
  });
}
