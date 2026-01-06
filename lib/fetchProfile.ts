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
  endAt,
  startAt,
} from "firebase/firestore";
import { app } from "./firebaseLib";

const db = getFirestore(app);

export interface Profile {
  id: string;
  name: string;
  role: string;
  address: string;
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
  searchQuery: string
) => {
  const postsRef = collection(db, "resumes");

  // 1. Determine constraints array
  let queryConstraints: any[] = [];

  const searchIsActive = searchQuery && searchQuery.trim().length > 0;

  if (searchIsActive) {
    // Search is active (Prefix search)
    // CRITICAL: Must order by 'name' for startAt/endAt to work.
    queryConstraints.push(orderBy('profile.role'));
    queryConstraints.push(startAt(searchQuery));
    queryConstraints.push(endAt(searchQuery + "\uf8ff"));
  } else {
    // No search, just standard sorting by 'createdAt'
    queryConstraints.push(orderBy('createdAt', 'desc'));
  }

  // 2. Add Pagination Constraint (Start Cursor)
  if (lastDoc) {
    // StartAfter must follow the established ordering/search constraints
    queryConstraints.push(startAfter(lastDoc));
  }

  // 3. Add Limit Constraint
  queryConstraints.push(limit(pageSize));

  // 4. Construct the final query
  const q = query(postsRef, ...queryConstraints);

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
