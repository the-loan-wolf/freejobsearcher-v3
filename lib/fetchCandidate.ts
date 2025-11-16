import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import { ResumeType } from "./types";

const db = getFirestore(app);

export default async function fetchCandidate(uid: string) {
  if (uid) {
    try {
      // User is guaranteed non-null here, so we can use user.uid
      const docRef = doc(db, "resumes", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Set the form state
        return { ...docSnap.data(), id: docSnap.id, isFavorited: false } as ResumeType;
      } else {
        // Document does not exist (e.g., new user)
        console.log("No resume document founde.");
      }
    } catch (error) {
      // Log any errors that occurred during the process
      console.error("Failed to fetch user resume data:", error);
    }
  }
}
