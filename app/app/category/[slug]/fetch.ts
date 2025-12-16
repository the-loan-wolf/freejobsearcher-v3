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
  where,
} from "firebase/firestore";
import { app } from "@/lib/firebaseLib";

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
  category: string,
) => {
  const postsRef = collection(db, "resumes");

  // 1. Determine constraints array
  let constraints: any[] = [];

  const searchIsActive = category.trim().length > 0;

  if (searchIsActive) {
    constraints.push(where("categories", "array-contains", category));
  }

  //constraints.push(orderBy("createdAt", "desc")); // this is not working

  // 2. Add Pagination Constraint (Start Cursor)
  if (lastDoc) {
    // StartAfter must follow the established ordering/search constraints
    constraints.push(startAfter(lastDoc));
  }

  // 3. Add Limit Constraint
  constraints.push(limit(pageSize));

  // 4. Construct the final query
  const q = query(postsRef, ...constraints);

  const snapshot = await getDocs(q);
  const profile = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data().profile,
        skills: [...doc.data().skills],
        isFavorited: false,
      }) as Profile,
  );

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { profile, lastVisible };
};
