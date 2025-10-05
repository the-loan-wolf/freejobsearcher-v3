"use client"

import { useState, useMemo } from "react"
import { CandidateCard } from "@/components/app-components/candidate-card"
import { Button } from "@/components/app-components/ui/button"

const candidates = [
  {
    id: 1,
    name: "Sunny Das",
    role: "UI & UX Designer",
    location: "Mumbai, India",
    salary: "₹25,000",
    image: "/ui-designer-headshot.png",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    experience: "3+ years",
  },
  {
    id: 2,
    name: "Vikas Kumar",
    role: "Software Developer",
    location: "Bangalore, India",
    salary: "₹10,000",
    image: "/software-developer-headshot.png",
    skills: ["React", "Node.js", "Python"],
    experience: "2+ years",
  },
  {
    id: 3,
    name: "Akashdeep Anand",
    role: "Full Stack Developer",
    location: "Delhi, India",
    salary: "₹50,000",
    image: "/professional-headshot-of-full-stack-developer.jpg",
    skills: ["JavaScript", "MongoDB", "Express"],
    experience: "5+ years",
  },
  {
    id: 4,
    name: "Ashish Raj",
    role: "Doctor",
    location: "Chennai, India",
    salary: "₹12,000",
    image: "/doctor-headshot.png",
    skills: ["General Medicine", "Patient Care"],
    experience: "4+ years",
  },
  {
    id: 5,
    name: "Rishav Bhardwaj",
    role: "Account Manager",
    location: "Pune, India",
    salary: "₹30,000",
    image: "/professional-headshot-of-account-manager.jpg",
    skills: ["Client Relations", "Sales", "CRM"],
    experience: "3+ years",
  },
  {
    id: 6,
    name: "Aniket Singh",
    role: "Account Manager",
    location: "Hyderabad, India",
    salary: "₹30,000",
    image: "/professional-headshot-of-account-manager-male.jpg",
    skills: ["Business Development", "Analytics"],
    experience: "2+ years",
  },
  {
    id: 7,
    name: "Sujata Sharma",
    role: "Account Manager",
    location: "Kolkata, India",
    salary: "₹30,000",
    image: "/professional-headshot-of-female-account-manager.jpg",
    skills: ["Project Management", "Communication"],
    experience: "4+ years",
  },
  {
    id: 8,
    name: "Simran Kaur",
    role: "Account Manager",
    location: "Jaipur, India",
    salary: "₹30,000",
    image: "/images/team-member-2.png",
    skills: ["Strategic Planning", "Team Leadership"],
    experience: "3+ years",
  },
  {
    id: 9,
    name: "Purva Mehta",
    role: "Account Manager",
    location: "Ahmedabad, India",
    salary: "₹30,000",
    image: "/female-project-manager-headshot.png",
    skills: ["Client Success", "Data Analysis"],
    experience: "2+ years",
  },
  {
    id: 10,
    name: "Robin Gupta",
    role: "Account Manager",
    location: "Lucknow, India",
    salary: "₹30,000",
    image: "/business-executive-headshot.png",
    skills: ["Relationship Building", "Negotiation"],
    experience: "5+ years",
  },
]

interface CandidateGridProps {
  searchQuery?: string
}

export function CandidateGrid({ searchQuery = "" }: CandidateGridProps) {
  const [visibleCount, setVisibleCount] = useState(6)

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidates

    const query = searchQuery.toLowerCase()
    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.role.toLowerCase().includes(query) ||
        candidate.location.toLowerCase().includes(query) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(query)),
    )
  }, [searchQuery])

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredCandidates.length))
  }

  const displayedCandidates = filteredCandidates.slice(0, Math.min(visibleCount, filteredCandidates.length))

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
