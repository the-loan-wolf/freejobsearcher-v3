import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProfile, Profile } from "../lib/fetchProfile";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import mapProfilesToFavorites, {
  FavoritesData,
} from "@/lib/mapProfilesToFavorites";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const db = getFirestore(app);

export async function fetchFavorites(user: User) {
  try {
    const docRef = doc(db, "favorites", user.uid);
    const response = await getDoc(docRef);
    if (response.exists()) {
      return response.data() as FavoritesData;
    }
    return { favorites: [{ uid: "" }] } as FavoritesData;
  } catch (error) { }
}

export const usePaginatedPosts = (pageSize = 10, searchQuery: string) => {
  const { user } = useAuth();
  const {
    data,
    fetchNextPage, // This is the new 'loadMore'
    hasNextPage, // This tells us if there *is* a next page
    isLoading, // True on initial load
    isFetchingNextPage, // True only when fetching the next page
  } = useInfiniteQuery({
    // Query Key: Unique ID for this data
    // Includes 'pageSize' so if you change page size, it's a new query
    queryKey: ["profiles", pageSize, searchQuery],

    // Query Function: The function that fetches the data
    // It's passed an object with `pageParam`
    // `pageParam` is what we will use as our 'lastDoc' cursor
    queryFn: ({ pageParam }) => {
      // pageParam will be null on the first page
      // and a QueryDocumentSnapshot on subsequent pages
      return fetchProfile(pageSize, pageParam, searchQuery);
    },

    // Initial Page Param: What to use for `pageParam` on the very first fetch
    initialPageParam: null as QueryDocumentSnapshot | null,

    // Get Next Page Param:
    // This function tells TanStack Query what to use for the *next* `pageParam`
    // It receives the data from the *last* successful fetch (lastPage)
    getNextPageParam: (lastPage) => {
      // `lastPage` is the object returned from `fetchProfile`: { profile, lastVisible }
      // If `lastVisible` exists, that's our next cursor.
      // If it's undefined (no more docs), this will return `undefined`,
      // which signals to `useInfiniteQuery` that there are no more pages.
      return lastPage.lastVisible ?? undefined;
    },
  });

  // Map the data to the flat array your components expect
  // `data.pages` is an array of all fetched pages.
  // Each page is { profile: [ ... ], lastVisible: ... }
  // We just want a flat array of all the profiles.
  const oldposts: Profile[] = data?.pages.flatMap((page) => page.profile) ?? [];

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(user!),
    enabled: !!user,
    staleTime: Infinity
  });
  const posts = mapProfilesToFavorites(
    oldposts,
    favorites || { favorites: [{ uid: "" }] },
  );

  // Return an object similar to your original hook
  return {
    posts,
    loadMore: fetchNextPage, // Rename `fetchNextPage` to `loadMore`
    loading: isLoading, // Loading state for the initial fetch
    isFetchingMore: isFetchingNextPage, // Loading state for "load more" button
    noMore: !hasNextPage, // `hasNextPage` is false when there are no more pages
  };
};
