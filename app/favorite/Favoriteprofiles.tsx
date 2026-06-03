"use client";

import {
  CandidateCard,
  CandidateGridSkeleton,
} from "@/components/app-components/candidate-card";
import { useAuth } from "@/hooks/useAuth";
import { UserX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFavorites } from "@/hooks/usePaginatedPosts";
import { FavoritesData } from "@/lib/mapProfilesToFavorites";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import { Spinner } from "@/components/app-components/ui/spinner";

const db = getFirestore(app);

async function fetchFavoriteProfiles({ favorites }: FavoritesData) {
  const docs = await Promise.all(
    favorites.map(async ({ uid }) => {
      const ref = doc(db, "resumes", uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return null;

      const data = snap.data();

      return {
        id: snap.id,
        ...data.profile,
        skills: data.skills ?? [],
        isFavorited: true,
      };
    }),
  );

  return docs.filter((doc): doc is NonNullable<typeof doc> => doc !== null);
}

export function FavoriteProfiles() {
  const { user, loading: isAuthLoading } = useAuth();

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(user as NonNullable<typeof user>),
    enabled: !!user,
    staleTime: Infinity,
  });

  const {
    data: profilesData,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["favorite-profiles", user?.uid],
    queryFn: () => fetchFavoriteProfiles(favorites!),
    enabled: !!favorites,
  });

  // const {
  //   data: profilesData,
  //   isLoading: profileLoading,
  //   isError: profileError,
  // } = useQuery({
  //   queryKey: ["favorite-profiles", user?.uid],
  //   queryFn: async () => {
  //     const favorites = await fetchFavorites(user!);
  //     return fetchFavoriteProfiles(favorites!);
  //   },
  //   enabled: !!user,
  // });

  // --- Render Logic ---
  //
  // State 1: Auth is checking (show a simple, page-wide loader)
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="size-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please sign in to view your profile.
      </div>
    );
  }

  // Conditional render (not early return)
  if (profileLoading) return <CandidateGridSkeleton />;

  if (profileError)
    return (
      <div className="flex justify-center items-center h-screen">
        Some Error Happens
      </div>
    );

  const profiles = profilesData ?? [];

  return (
    <div className="space-y-8">
      {profiles && (
        <div className="text-sm text-muted-foreground">
          Found <strong>{profiles.length}</strong> candidate
          {profiles.length !== 1 ? "s" : ""} in your{" "}
          <strong>"Favorites"</strong>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-full flex justify-center">
            <UserX size={48} />
          </div>
          <p className="text-muted-foreground">
            You have no favorite profiles!
          </p>
        </div>
      )}
    </div>
  );
}
