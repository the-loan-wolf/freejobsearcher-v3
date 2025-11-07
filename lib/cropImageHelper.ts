// cropImageHelper.ts

import { Area } from "react-easy-crop";

export default function getCroppedImg(imageSrc: string, pixelCrop: Area) {
  return new Promise<File>((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get 2D context");
      }

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
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const randomStr = Math.random().toString(36).substring(2, 10); // e.g. "x83h2k9a"
        const fileName = `profilepic_${randomStr}.jpeg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    };
    image.onerror = () => reject(new Error("Failed to load image"));
  });
}
