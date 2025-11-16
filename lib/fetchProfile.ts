import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getFirestore,
  Timestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { app } from "./firebaseLib";

const db = getFirestore(app);

export interface Profile {
  id: string;
  name: string;
  role: string;
  location: string;
  salary: string;
  image: string;
  experience: string;
  bio: string;
  skills: string[];
  createdAt: Timestamp;
  isFavorited: boolean;
}

export const fetchProfile = async (
  pageSize: number,
  lastDoc: QueryDocumentSnapshot | null = null,
) => {
  const postsRef = collection(db, "resumes");

  let q = query(postsRef, orderBy("createdAt", "desc"), limit(pageSize));

  if (lastDoc) {
    q = query(
      postsRef,
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize),
    );
  }

  const snapshot = await getDocs(q);
  const profile = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data().profile,
        skills: [...doc.data().skills],
        isFavorited: false,
      }) as Profile, // Type assertion here — we know the structure of the data
  );

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { profile, lastVisible };
};
