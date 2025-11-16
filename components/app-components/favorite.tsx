import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  doc,
  setDoc,
  arrayUnion, // Import arrayUnion
  arrayRemove, // Import arrayRemove
  getFirestore,
} from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQueryClient

// --- TYPE DEFINITIONS --- //

// Define the shape of the context object used for optimistic rollback
interface MutationContext {
  previousState: boolean;
}

// Define the expected function signature for the mutation executor
// Variables are 'void' since we are using .mutate() without arguments inside the handler.
type MutationExecutor = (uid: string, userId: string) => Promise<void>;

// --- FIRESTORE UTILITY FUNCTIONS --- //

/**
 * Executes the Firestore update to add a UID to the favorites array.
 * @param uid The ID of the item to favorite.
 * @param userId The UID of the current user.
 */
const saveAsFavoriteAction: MutationExecutor = async (uid, userId) => {
  const db = getFirestore(app);
  const docRef = doc(db, "favorites", userId);

  await setDoc(
    docRef,
    {
      favorites: arrayUnion({ uid }),
    },
    { merge: true },
  );
};

/**
 * Executes the Firestore update to remove a UID from the favorites array.
 * @param uid The ID of the item to unfavorite.
 * @param userId The UID of the current user.
 */
const removeFromFavoriteAction: MutationExecutor = async (uid, userId) => {
  const db = getFirestore(app);
  const docRef = doc(db, "favorites", userId);

  await setDoc(
    docRef,
    {
      favorites: arrayRemove({ uid }),
    },
    { merge: true },
  );
};

// --- REACT COMPONENT --- //

export default function Favorite({
  className,
  innerText,
  uid,
  isFavorited: initialFavorited = false, // Add prop for initial state
}: {
  className?: string;
  innerText?: string;
  uid: string;
  isFavorited?: boolean; // Type for new prop
}) {
  // --- HOOKS & STATES --- //
  const queryClient = useQueryClient();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const { user } = useAuth();
  const userId = user?.uid;

  // Function to execute the mutation (either save or remove)
  // These functions are now correctly defined outside the mutation options object.
  const executeSaveMutation = () => saveAsFavoriteAction(uid, userId!);
  const executeRemoveMutation = () => removeFromFavoriteAction(uid, userId!);

  // --- MUTATIONS --- //

  // Mutation for saving the favorite
  const saveMutation = useMutation<void, Error, void, MutationContext>({
    mutationFn: executeSaveMutation,
    onMutate: async () => {
      // Optimistic update: Temporarily set the state to favorited
      const previousState = isFavorited;
      setIsFavorited(true);
      return { previousState }; // Return context object
    },
    onError: (
      err: Error,
      variables: void,
      context: MutationContext | undefined,
    ) => {
      // Rollback state on error
      setIsFavorited(context?.previousState ?? false);
      toast.error("Error saving favorite. Please try again.");
      console.error("Error while marking account favorite:", err);
    },
    onSettled: () => {
      // Invalidate the favorites query to refresh the list in the background
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // Mutation for removing the favorite
  const removeMutation = useMutation<void, Error, void, MutationContext>({
    mutationFn: executeRemoveMutation,
    onMutate: async () => {
      // Optimistic update: Temporarily set the state to not favorited
      const previousState = isFavorited;
      setIsFavorited(false);
      return { previousState }; // Return context object
    },
    onError: (
      err: Error,
      variables: void,
      context: MutationContext | undefined,
    ) => {
      // Rollback state on error
      setIsFavorited(context?.previousState ?? true);
      toast.error("Error removing favorite. Please try again.");
      console.error("Error removing favorite:", err);
    },
    onSettled: () => {
      // Invalidate the favorites query to refresh the list in the background
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // --- HANDLERS --- //
  const favoriteButtonHandler = () => {
    if (!user || !userId) {
      toast.warning("Need to Sign In first");
      return;
    }

    // Determine the desired action based on the current local state
    if (isFavorited) {
      // If currently favorited, remove it
      removeMutation.mutate();
    } else {
      // If currently unfavorited, save it
      saveMutation.mutate();
    }
  };

  // --- RENDER --- //
  // Use 'isPending' instead of 'isLoading' for modern React Query
  const isPending = saveMutation.isPending || removeMutation.isPending;

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={favoriteButtonHandler}
      disabled={isPending}
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
        className={`lucide lucide-star-icon lucide-star h-4 w-4 ${isPending ? "animate-spin opacity-50" : ""}`}
      >
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
      {innerText}
    </Button>
  );
}
