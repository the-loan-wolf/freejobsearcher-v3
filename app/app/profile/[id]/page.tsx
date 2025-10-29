"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Star,
  Mail,
  Phone,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/app-components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/app-components/ui/card";
import { Badge } from "@/components/app-components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/app-components/ui/avatar";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchFeed(uid: string) {
  const res = await fetch(`https://freejob.patna.workers.dev/resume/${uid}`);
  if (res.status === 404) notFound();
  const data = await res.json();
  return data;
}

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Skeleton UI shown while loading
function ProfileSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column skeleton */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-muted" />
                <div className="h-5 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded" />
                <div className="h-3 w-1/4 bg-muted rounded" />
                <div className="w-full border-t border-border/50 pt-4 mt-2 space-y-3">
                  <div className="h-4 w-1/2 bg-muted rounded mx-auto" />
                  <div className="flex flex-col gap-2">
                    <div className="h-10 bg-muted rounded" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="h-5 w-1/3 bg-muted rounded" />
                <div className="space-y-2">
                  {[...Array(3)].map((__, j) => (
                    <div key={j} className="h-3 w-full bg-muted rounded" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page with conditional rendering
export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const candidateId = id;
  if (!candidateId) notFound();

  const {
    data: candidate,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["candidateProfile", candidateId],
    queryFn: () => fetchFeed(candidateId),
  });

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !candidate) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300"
            >
              FreeJobSearcher
            </Link>
            <h1 className="text-xl font-bold text-foreground">
              Profile Details
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/10">
                    <AvatarImage
                      src={candidate.profile.image || "/placeholder.svg"}
                      alt={candidate.profile.name}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {candidate.profile.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {candidate.profile.name}
                    </h2>
                    <p className="text-lg text-primary font-medium">
                      {candidate.profile.role}
                    </p>

                    <div className="flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {candidate.profile.location}
                    </div>

                    <div className="flex items-center justify-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {candidate.profile.experience}
                    </div>
                  </div>

                  <div className="w-full pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        Expected Salary
                      </span>
                      <span className="font-bold text-xl text-primary">
                        {candidate.profile.salary}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Candidate
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Save Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {candidate.profile.bio}
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.contact?.phones?.map((phone: any, i: number) => (
                  <div key={`phone-${i}`} className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{phone}</span>
                  </div>
                ))}
                {candidate.contact?.emails?.map((email: any, i: number) => (
                  <div key={`email-${i}`} className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>{email}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>
                    Joined {new Date(candidate.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.map((skill: string) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.workHistory?.map((work: any, index: number) => (
                  <div
                    key={index}
                    className="border-l-2 border-primary/20 pl-4"
                  >
                    <h4 className="font-semibold text-foreground">
                      {work.position}
                    </h4>
                    <p className="text-primary font-medium">{work.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {work.duration}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.education?.map((edu: any, index: number) => (
                  <div
                    key={index}
                    className="border-l-2 border-primary/20 pl-4"
                  >
                    <h4 className="font-semibold text-foreground">
                      {edu.degree}
                    </h4>
                    <p className="text-primary font-medium">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {candidate.achievements?.map(
                    (achievement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {achievement}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
