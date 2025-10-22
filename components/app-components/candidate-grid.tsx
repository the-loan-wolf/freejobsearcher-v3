"use client"

import { useState, useMemo } from "react"
import { CandidateCard, CandidateGridSkeleton } from "@/components/app-components/candidate-card"
import { Button } from "@/components/app-components/ui/button"
import { useQuery } from "@tanstack/react-query"

interface CandidateGridProps {
  searchQuery?: string
}

interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  salary: string;
  image: string;
  experience: string;
  bio: string;
  skills: string[];
}

async function fetchFeed(): Promise<Candidate[]> {
  const res = await fetch("https://freejob.patna.workers.dev/user/feed");
  if (!res.ok) throw new Error("Failed to fetch feed");
  return res.json();
}

export function CandidateGrid({ searchQuery = "" }: CandidateGridProps) {
  const [visibleCount, setVisibleCount] = useState(6)
  const { data, error, isLoading } = useQuery({
    queryKey: ["userFeed"],
    queryFn: fetchFeed,
  });

  const filteredCandidates = useMemo(() => {
    if (!data) return []; // safely handle undefined

    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.role.toLowerCase().includes(query) ||
        candidate.location.toLowerCase().includes(query) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  }, [searchQuery, data]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredCandidates.length));
  };

  const displayedCandidates = filteredCandidates.slice(
    0,
    Math.min(visibleCount, filteredCandidates.length)
  );

  // Conditional render (not early return)
  if (isLoading) return <CandidateGridSkeleton />
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-8">
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Found {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? "s" : ""}
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCandidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>

      {filteredCandidates.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No candidates found matching your search.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms.</p>
        </div>
      )}

      {visibleCount < filteredCandidates.length && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline" size="lg">
            Load More Candidates
          </Button>
        </div>
      )}
    </div>
  )
}
