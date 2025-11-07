import { ChangeEvent, useRef, useState } from "react";
import CropperComponent from "@/components/app-components/CropperComponent";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebaseLib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/app-components/ui/avatar";
import { Button } from "./ui/button";
import { toast } from "sonner";

const storage = getStorage(app);

const uploadPic = async (picFile: File): Promise<string> => {
  // Create a reference to the file you want to upload
  const fileRef = ref(storage, "profile-pics/" + picFile.name);
  try {
    await uploadBytes(fileRef, picFile);
    console.log("Uploaded the pic!");
    const url = await getDownloadURL(fileRef);
    console.log(url);
    return url;
  } catch (error) {
    console.error(error);
    return "error";
  }
};

export default function ProfilePicUpload() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const picInput = useRef<null | HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = (croppedFile: File) => {
    const url = URL.createObjectURL(croppedFile);
    setCroppedImage(croppedFile);
    setUrl(url);
  };

  const clickHandler = async (event: React.MouseEvent) => {
    event.preventDefault();
    const picFile = croppedImage;
    if (picFile) {
      const url = await uploadPic(picFile);
      if (!(url === "error")) {
        setUrl(url);
        setIsUploaded(true);
      }
      toast.success("Image uploaded");
    } else {
      console.warn("No file selected");
      toast.warning("No file selected");
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <Avatar className="h-16 w-16">
        <AvatarImage src={url || "/image-profile.jpg"} alt="Profile" />
        <AvatarFallback>Pic</AvatarFallback>
      </Avatar>
      <input
        type="file"
        accept="image/*"
        id="profilePic"
        ref={picInput}
        onChange={handleFileChange}
        className="hidden"
        onClick={() => setCroppedImage(null)}
      />
      <label
        htmlFor="profilePic"
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3"
      >
        Choose Image
      </label>

      {imageSrc && (
        <CropperComponent
          imageSrc={imageSrc}
          onCropDone={handleCropDone}
          open={isOpen}
          handler={setIsOpen}
        />
      )}

      {url && <Button variant="outline" size="sm" onClick={clickHandler} className="bg-lime-200 hover:-translate-y-1 hover:scale-110 hover:bg-lime-300 transition ease-in-out">
        Upload Picture
      </Button>}
      {isUploaded && (
        <p className="text-xs text-red-600">
          Click &quot;Save Data&quot; Button in the bottom to save Pic
        </p>
      )}
    </div>
  );
}
