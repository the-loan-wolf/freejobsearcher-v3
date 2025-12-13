"use client";

import { useState } from "react";
import { Header } from "./header";
import { CandidateGridCategory } from "./category-candidate-grid";
import { deslugify } from "@/lib/utils";

export function CategoryRouteComponent({ slug }: { slug: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="container mx-auto px-4 py-8">
        {!searchQuery && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground my-4 text-balance">{deslugify(slug)}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              Browse through our curated list of talented professionals ready to join your team.
            </p>
          </div>)}
        <CandidateGridCategory searchQuery={searchQuery} category={slug} />
      </main>
    </>
  );
}
