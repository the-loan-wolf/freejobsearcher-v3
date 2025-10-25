"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CandidateCard,
  CandidateGridSkeleton,
} from "@/components/app-components/candidate-card";
import { Button } from "@/components/app-components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
} from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import Link from "next/link";

interface CandidateGridProps {
  searchQuery?: string;
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

const db = getFirestore(app);
async function fetchFeed(user: User | null): Promise<Candidate[]> {
  const collectionRef = collection(db, "resumes");
  const q = query(collectionRef, limit(user ? 6 : 5));
  const querySnapshot = await getDocs(q);
  const documents: Candidate[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({
      id: doc.id,
      ...doc.data().profile,
      skills: [...doc.data().skills],
    });
  });
  return documents;
}

export function CandidateGrid({ searchQuery = "" }: CandidateGridProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);
  const { data, error, isLoading } = useQuery({
    queryKey: ["userFeed", user?.uid],
    queryFn: () => fetchFeed(user),
  });

  // Listen for Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, [auth]);

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
  if (isLoading) return <CandidateGridSkeleton />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-8">
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Found {filteredCandidates.length} candidate
          {filteredCandidates.length !== 1 ? "s" : ""}
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
          <p className="text-muted-foreground">
            No candidates found matching your search.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search terms.
          </p>
        </div>
      )}

      {user ? visibleCount < filteredCandidates.length && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline" size="lg">
            Load More Candidates
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Link href={'/app/signin'} className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90">
            Sign In to see more
          </Link>
        </div>
      )}
    </div>
  );
}
