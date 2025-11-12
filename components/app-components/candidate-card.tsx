import { MapPin, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/app-components/ui/card";
import { Button } from "@/components/app-components/ui/button";
import { Badge } from "@/components/app-components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/app-components/ui/avatar";
import Link from "next/link";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { useState } from "react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  salary: string;
  image: string;
  skills: string[];
  experience: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  user: User | null;
}

export function CandidateGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="group border-primary/10 p-6 animate-pulse">
            <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
              {/* Avatar */}
              <div className="h-20 w-20 rounded-full bg-muted ring-2 ring-primary/10" />

              {/* Name and Role */}
              <div className="space-y-2 w-full">
                <div className="h-5 bg-muted rounded w-2/3 mx-auto" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              </div>

              {/* Location and Experience */}
              <div className="space-y-1 w-full">
                <div className="h-3 bg-muted rounded w-1/3 mx-auto" />
                <div className="h-3 bg-muted rounded w-1/4 mx-auto" />
              </div>

              {/* Skills */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-5 w-16 bg-muted rounded-full" />
                ))}
              </div>

              {/* Divider */}
              <div className="w-full border-t border-primary/10 pt-4 mt-2" />

              {/* Salary */}
              <div className="flex items-center justify-between w-full px-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 w-full mt-3">
                <div className="h-9 flex-1 bg-muted rounded-md" />
                <div className="h-9 w-10 bg-muted rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CandidateCard({ candidate, user }: CandidateCardProps) {
  // --- STATES --- //
  const [condition, setCondition] = useState("none");

  // --- HANDLERS --- //
  const favoriteButtonHandler = () => {
    if (!user) {
      toast.warning("Need to Sign In first");
    } else {
      setCondition((prev) => (prev === "none" ? "yellow" : "none"));
    }
  };

  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 border-primary/10 hover:border-primary/30">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
            <AvatarImage
              src={candidate.image || "/placeholder.svg"}
              alt={candidate.name}
            />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary group-hover:bg-primary/20">
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h3 className="font-bold text-lg text-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {candidate.name}
            </h3>
            <p className="text-primary font-medium group-hover:text-accent transition-colors duration-300">
              {candidate.role}
            </p>

            <div className="flex items-center justify-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              <MapPin className="h-4 w-4 mr-1" />
              {candidate.location}
            </div>

            <div className="flex items-center justify-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              <Clock className="h-4 w-4 mr-1" />
              {candidate.experience}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 justify-center">
            {candidate.skills.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs border-primary/10 group-hover:border-primary/20 group-hover:bg-primary/90"
              >
                {skill}
              </Badge>
            ))}
          </div>

          <div className="w-full pt-2 border-t border-gradient-to-r from-transparent via-primary/20 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Expected Salary
              </span>
              <span className="font-bold text-lg text-primary group-hover:text-accent group-hover:drop-shadow-sm transition-all duration-300">
                ₹{candidate.salary}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                className="transition-all duration-300 shadow-lg hover:shadow-primary/20"
                size="sm"
                asChild
              >
                <Link
                  href={`/app/profile/${candidate.id}`}
                  target="_blank"
                  className="w-[85%]"
                >
                  View Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/20 hover:border-primary/40 hover:bg-primary/10 hover:text-primary bg-transparent"
                onClick={favoriteButtonHandler}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill={condition}
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star-icon lucide-star h-4 w-4"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
