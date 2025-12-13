"use client";

import {
  CandidateCard,
  CandidateGridSkeleton,
} from "@/components/app-components/candidate-card";
import { Button } from "@/components/app-components/ui/button";
import Link from "next/link";
import { usePaginatedPosts } from "@/hooks/usePaginatedPosts";
import { useAuth } from "@/hooks/useAuth";
import { SearchX } from "lucide-react";
import { FilterComponent } from "./FilterComponent";

interface CandidateGridProps {
  searchQuery?: string;
  category: string;
}

export function CandidateGridCategory({ searchQuery = "" }: CandidateGridProps) {
  const { posts, loadMore, loading, isFetchingMore, noMore } =
    usePaginatedPosts(5, searchQuery);
  const { user } = useAuth();

  // Conditional render (not early return)
  if (loading) return <CandidateGridSkeleton />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6">
      <aside className="lg:block">
        <FilterComponent />
      </aside>
      <div className="space-y-8">
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Found <strong>{posts.length}</strong> candidate
            {posts.length !== 1 ? "s" : ""} for <strong>"{searchQuery}"</strong>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>

        {posts.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-full flex justify-center">
              <SearchX size={48} />
            </div>
            <p className="text-muted-foreground">
              No candidates found matching your search.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search terms.
            </p>
          </div>
        )}

        {user ? (
          !loading &&
          !noMore && (
            <div className="flex justify-center">
              <Button
                onClick={() => loadMore()}
                disabled={isFetchingMore || noMore}
                variant="outline"
                size="lg"
              >
                Load More Candidates
              </Button>
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <Button asChild>
              <Link href={"/app/signin"}>Sign In to see more</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
