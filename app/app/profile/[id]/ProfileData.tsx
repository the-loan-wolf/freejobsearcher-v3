"use client";

import { notFound } from "next/navigation";
import fetchCandidate from "@/lib/fetchCandidate";
import { fetchFavorites } from "@/hooks/usePaginatedPosts";
import ProfileClientUI from "./ProfileClientUI";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import ProfileSkeleton from "@/components/app-components/profileSkeleton";

export default function ProfileData({ candidateId }: { candidateId: string }) {

  const { user } = useAuth();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [candidateId],
    queryFn: () => fetchCandidate(candidateId),
    staleTime: Infinity
  });

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(user!),
    enabled: !!user,
    staleTime: Infinity
  });

  let ytVideoID: string | null = "";
  if (post && post.ytVid) {
    const url = new URL(post.ytVid).searchParams;
    ytVideoID = url.get("v");
  }

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !post) notFound();

  // 1. Create a safe reference to the array, providing an empty array as a fallback.
  const favoritesArray = favorites?.favorites ?? [];
  // 2. Create the Set using the safe array reference.
  const favoriteUidSet = new Set(favoritesArray.map((fav) => fav.uid));
  // 3. Use the Set for quick lookup.
  const candidate = {
    ...post,
    isFavorited: favoriteUidSet.has(candidateId)
  };

  return (
    <ProfileClientUI
      candidatePost={post}
      user={user} // Pass the user object
      initialIsFavorited={candidate.isFavorited} // Pass the pre-calculated favorite status
      ytVideoID={ytVideoID}
    />
  );
}
