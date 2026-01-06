import { MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/app-components/ui/card";
import { Button } from "@/components/app-components/ui/button";
import { Badge } from "@/components/app-components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/app-components/ui/avatar";
import Link from "next/link";
import Favorite from "./favorite";
import { Profile } from "@/lib/fetchProfile";

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

export function CandidateCard({ candidate }: { candidate: Profile }) {
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
              {candidate.address}
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
                  // target="_blank"
                  className="w-[85%]"
                >
                  View Profile
                </Link>
              </Button>
              <Favorite
                uid={candidate.id}
                isFavorited={candidate.isFavorited}
                className="border-primary/20 hover:border-primary/40 hover:bg-primary/10 hover:text-primary bg-transparent"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
