import { MapPin, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/app-components/ui/card";
import { Button } from "@/components/app-components/ui/button";
import { Badge } from "@/components/app-components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/app-components/ui/avatar";
import Link from "next/link";

interface Candidate {
  id: number;
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
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Card className="group glass hover:glass-strong transition-all duration-100 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 border-primary/10 hover:border-primary/30">
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
                className="text-xs glass border-primary/10 group-hover:border-primary/20 group-hover:bg-primary/10"
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
                {candidate.salary}
              </span>
            </div>

            <div className="flex gap-2">
              <Link href={`/app/profile/${candidate.id}`} className="flex-1">
                <Button
                  className="w-full transition-all duration-300 shadow-lg hover:shadow-primary/20"
                  size="sm"
                >
                  View Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="glass border-primary/20 hover:border-primary/40 hover:bg-primary/10 hover:text-primary bg-transparent"
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
