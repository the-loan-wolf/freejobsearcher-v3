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

// export type Profile = {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: Timestamp; // or Timestamp from Firestore
// };

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
      }) as Profile, // Type assertion here — we know the structure of the data
  );

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { profile, lastVisible };
};
