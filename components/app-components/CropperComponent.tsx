// CropperComponent.tsx
import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { Button } from "./ui/button";
import getCroppedImg from "@/lib/cropImageHelper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/app-components/ui/dialog";

const CropperComponent = ({
  imageSrc,
  onCropDone,
  open,
  handler,
}: {
  imageSrc: string;
  onCropDone: (croppedFile: File) => void;
  open: any;
  handler: any;
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    // Add a check to ensure crop area is not null
    if (!croppedAreaPixels) {
      console.error("Crop area is not set.");
      return;
    }

    try {
      const croppedImage: File = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );

      onCropDone(croppedImage);
      handler(false);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handler}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop profile</DialogTitle>
          </DialogHeader>
          <div className="p-5">
            {/* This div needs a defined size for react-easy-crop to work.
              Let's give it a relative parent container.
            */}
            <div className="relative h-64 w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, zoom) => setZoom(zoom as number)}
              className="mt-4"
            />
            <Button
              onClick={handleCrop}
              variant="outline"
              className="mt-4 w-full"
            >
              Crop
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CropperComponent;
