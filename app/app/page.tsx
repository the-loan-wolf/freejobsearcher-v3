"use client"

import { useState } from "react"
import { Header } from "@/components/app-components/header"
import { CandidateGrid } from "@/components/app-components/candidate-grid"
import { Footer } from "@/components/app-components/footer"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="container mx-auto px-4 py-8">
        {!searchQuery && (<div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Find Your Perfect Candidate</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Browse through our curated list of talented professionals ready to join your team.
          </p>
        </div>)}
        <CandidateGrid searchQuery={searchQuery} />
      </main>
      <Footer />
    </>
  )
}
