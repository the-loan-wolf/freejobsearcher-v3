import CropperComponent from "@/components/app-components/CropperComponent";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/app-components/ui/avatar";
import { app } from "@/lib/firebaseLib";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { uploadImageAction } from "@/app/app/action";
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { dummyData } from "@/lib/dummyData";
import { profile } from "console";

const storage = getStorage(app);
const auth = getAuth();
const db = getFirestore(app);

/**
 * Uploads a file to Firebase Storage under a user-specific path.
 * @param picFile The file to upload.
 * @param userId The UID of the user.
 * @returns A promise that resolves with the download URL.
 */
const uploadPic = async (picFile: File, userId: string): Promise<string> => {
  // Use the file extension from the original file
  const fileExtension = picFile.name.split(".").pop() || "jpg";
  // Create a user-specific and predictable path.
  // This will overwrite any existing profile pic for this user.
  const fileRef = ref(
    storage,
    `profile-pics/${userId}/profile.${fileExtension}`,
  );
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

export default function ProfilePicUpload({ setParentUrlState }: { setParentUrlState: (key: string, value: string) => void }) {
  // The original image file (as a data URL) to be sent to the cropper
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // The *preview URL* (blob) of the *cropped* image
  const [url, setUrl] = useState("");

  // The *actual cropped File object* to be uploaded
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  // Dialog state for the cropper
  const [isOpen, setIsOpen] = useState(false);

  // Firebase user object
  const [user, setUser] = useState<User | null>(null);

  // Loading state for the upload button
  const [isLoading, setIsLoading] = useState(false);

  // Ref for the hidden file input
  const picInput = useRef<null | HTMLInputElement>(null);

  // --- Effects ---

  // Cleanup effect for the blob URL
  // This prevents memory leaks by revoking the old object URL
  // when a new one is created or when the component unmounts.
  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  // --- Handlers ---

  /**
   * Called when the user selects a file from the input.
   * Reads the file as a data URL and opens the cropper.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state in case we're re-uploading
    setCroppedFile(null);
    if (url) {
      URL.revokeObjectURL(url);
      setUrl("");
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsOpen(true);
    };
    reader.readAsDataURL(file);

    // Clear the file input value to allow selecting the same file again
    if (picInput.current) {
      picInput.current.value = "";
    }
  };

  /**
   * Called by the CropperComponent when cropping is complete.
   * Receives the cropped file as a File object.
   */
  const handleCropDone = (croppedFile: File) => {
    // 1. Store the actual File object for uploading
    setCroppedFile(croppedFile);

    // 2. Create and store a new preview URL
    const previewUrl = URL.createObjectURL(croppedFile);
    setUrl(previewUrl);
  };

  /**
   * Called when the "Upload Picture" button is clicked.
   * Uploads the croppedFile to Firebase Storage.
   */
  // const uploadHandler = async (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   setIsLoading(true);
  //
  //   // Guard clauses
  //   if (!croppedFile || !user) {
  //     console.warn("No cropped file or user session.");
  //     toast.warning("No file selected or user not logged in.");
  //     setIsLoading(false);
  //     return;
  //   }
  //
  //   // 1. Upload to Storage
  //   const downloadUrl = await uploadPic(croppedFile, user.uid);
  //
  //   if (downloadUrl === "error") {
  //     setIsLoading(false);
  //     return; // Error toast is handled inside uploadPic
  //   }
  //
  //   // 2. Update Auth Profile
  //   try {
  //     if (auth.currentUser) {
  //       await updateProfile(auth.currentUser, { photoURL: downloadUrl });
  //
  //       // Force-update local user state to show new pic immediately
  //       // Note: onAuthStateChanged will also fire, but this is faster.
  //       setUser({ ...auth.currentUser, photoURL: downloadUrl });
  //
  //       toast.success("Image uploaded!");
  //
  //       // 3. Clean up
  //       setCroppedFile(null);
  //       setUrl(""); // The 'displayImageSrc' will now use user.photoURL
  //       setImageSrc(null);
  //     }
  //   } catch (error) {
  //     console.error("Failed to update profile:", error);
  //     toast.error("Failed to update profile.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  /**
   * this image upload function is handle by our backend Server
   */

  const uploadHandler = async () => {
    setIsLoading(true);
    if (croppedFile) {
      try {
        // 1. Manually create the FormData object
        const formData = new FormData();
        formData.append('image', croppedFile);

        // 2. Call the Server Action with the constructed FormData
        const response = await uploadImageAction(formData);

        if (user) {
          await updateProfile(user, { photoURL: response.url });

          // Force-update local user state to show new pic immediately
          // Note: onAuthStateChanged will also fire, but this is faster.
          setUser({ ...user, photoURL: response.url || null });

          // Also set firstore profile pic field
          const docRef = doc(db, "resumes", user?.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // Document exists, so we update it
            await updateDoc(docRef, { "profile.image": response.url });
          } else {
            // Document does not exist, so we create it
            await setDoc(docRef, { ...dummyData, profile: { ...dummyData.profile, image: response.url } }, { merge: true });
          }

          // update the parent state
          setParentUrlState("image", response.url || "");

          toast.success("Image uploaded!");

          // 3. Clean up
          setCroppedFile(null);
          setUrl(""); // The 'displayImageSrc' will now use user.photoURL
          setImageSrc(null);
          setIsLoading(false);
        }

      } catch (error) {
        toast.error("Upload process failed unexpectedly.");
        console.log("image upload: ", error)
        setIsLoading(false);
      }

    }
  }

  // --- Render Logic ---

  // Determine which image to display:
  // 1. The new cropped preview (if it exists)
  // 2. The user's current photoURL (if they have one)
  // 3. The fallback placeholder

  const displayImageSrc = url || user?.photoURL || "/image-profile.jpg";

  return (
    <div className="flex items-center space-x-1">
      <Avatar className="h-16 w-16">
        <AvatarImage src={displayImageSrc} alt="Profile" />
        <AvatarFallback>Pic</AvatarFallback>
      </Avatar>
      <input
        type="file"
        accept="image/*"
        id="profilePic"
        ref={picInput}
        onChange={handleFileChange}
        className="hidden"
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

      {url && (
        <Button
          disabled={isLoading}
          variant="outline"
          size="sm"
          onClick={uploadHandler}
          className="bg-lime-200 hover:-translate-y-1 hover:scale-110 hover:bg-lime-300 transition ease-in-out"
        >
          {isLoading ? "Uploading..." : "Save Picture"}
        </Button>
      )}
    </div>
  );
}
