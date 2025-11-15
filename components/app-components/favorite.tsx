import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  doc,
  setDoc,
  arrayUnion, // Import arrayUnion
  arrayRemove, // Import arrayRemove
  getFirestore
} from "firebase/firestore";
import { app } from "@/lib/firebaseLib";

export default function Favorite({
  className,
  innerText,
  uid,
  isFavorited: initialFavorited = false // Add prop for initial state
}: {
  className?: string;
  innerText?: string;
  uid: string;
  isFavorited?: boolean; // Type for new prop
}) {
  // --- STATES --- //
  // State now tracks whether it is favorited (true/false)
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const { user } = useAuth();

  // --- HANDLERS --- //
  const favoriteButtonHandler = () => {
    if (!user) {
      toast.warning("Need to Sign In first");
      return;
    }

    // Toggle state locally
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);

    // Save/Remove from Firestore
    if (newFavoriteState) {
      saveAsFavorite();
    } else {
      removeFromFavorite();
    }
  };

  // --- FIRESTORE ACTIONS --- //

  // Function to add the UID to the favorites array
  const saveAsFavorite = async () => {
    const db = getFirestore(app);
    // The document ID should be the current user's UID to store their favorites
    const docRef = doc(db, "favorites", user!.uid);

    try {
      // Use updateDoc and arrayUnion to add the item to the array
      await setDoc(
        docRef,
        {
          // arrayUnion ensures the object is added only if it's not already present
          favorites: arrayUnion({ uid }),
        },
        { merge: true }
      );
    } catch (error) {
      // In case of error, revert the local state
      setIsFavorited(false);
      toast.error("Error saving favorite. Please try again.");
      console.error("Error while marking account favorite:", error);
    }
  }

  // Function to remove the UID from the favorites array
  const removeFromFavorite = async () => {
    const db = getFirestore(app);
    const docRef = doc(db, "favorites", user!.uid);

    try {
      // Use arrayRemove to remove the specific object from the array
      await setDoc(
        docRef,
        {
          favorites: arrayRemove({ uid }),
        },
        { merge: true }
      );
    } catch (error) {
      // In case of error, revert the local state
      setIsFavorited(true);
      toast.error("Error removing favorite. Please try again.");
      console.error("Error while removing account favorite:", error);
    }
  }

  // --- RENDER --- //
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={favoriteButtonHandler}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        // Fill based on the state
        fill={isFavorited ? "yellow" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-star-icon lucide-star h-4 w-4"
      >
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
      {innerText}
    </Button>
  );
}
