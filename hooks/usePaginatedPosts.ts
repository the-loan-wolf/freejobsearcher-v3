import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProfile, Profile } from "../lib/fetchProfile";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const usePaginatedPosts = (pageSize = 10) => {
  const {
    data,
    fetchNextPage, // This is the new 'loadMore'
    hasNextPage, // This tells us if there *is* a next page
    isLoading, // True on initial load
    isFetchingNextPage, // True only when fetching the next page
  } = useInfiniteQuery({
    // 1. Query Key: Unique ID for this data
    // Includes 'pageSize' so if you change page size, it's a new query
    queryKey: ["profiles", pageSize],

    // 2. Query Function: The function that fetches the data
    // It's passed an object with `pageParam`
    // `pageParam` is what we will use as our 'lastDoc' cursor
    queryFn: ({ pageParam }) => {
      // pageParam will be null on the first page
      // and a QueryDocumentSnapshot on subsequent pages
      return fetchProfile(pageSize, pageParam);
    },

    // 3. Initial Page Param: What to use for `pageParam` on the very first fetch
    initialPageParam: null as QueryDocumentSnapshot | null,

    // 4. Get Next Page Param:
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

  // 5. Map the data to the flat array your components expect
  // `data.pages` is an array of all fetched pages.
  // Each page is { profile: [ ... ], lastVisible: ... }
  // We just want a flat array of all the profiles.
  const posts: Profile[] = data?.pages.flatMap((page) => page.profile) ?? [];

  // 6. Return an object similar to your original hook
  return {
    posts,
    loadMore: fetchNextPage, // Rename `fetchNextPage` to `loadMore`
    loading: isLoading, // Loading state for the initial fetch
    isFetchingMore: isFetchingNextPage, // Loading state for "load more" button
    noMore: !hasNextPage, // `hasNextPage` is false when there are no more pages
  };
};
