"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  CircleUserRound,
  Video,
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
import { useAuth } from "@/hooks/useAuth";
import Favorite from "@/components/app-components/favorite";
import fetchCandidate from "@/lib/fetchCandidate";
import ProfileSkeleton from "@/components/app-components/profileSkeleton";
import { fetchFavorites } from "@/hooks/usePaginatedPosts";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Main page with conditional rendering
export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const candidateId = id;
  if (!candidateId) notFound();

  // --- STATES --- //
  const { user } = useAuth();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [candidateId],
    queryFn: () => fetchCandidate(candidateId),
  });

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavorites(user!),
    enabled: !!user,
  });

  let ytVideoID: string | null = "";
  if (post && post.ytVid) {
    const url = new URL(post.ytVid).searchParams;
    ytVideoID = url.get("v");
  }

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !post) notFound();

  // 1. Create a safe reference to the array, providing an empty array as a fallback.
  const favoritesArray = favorites?.favorites ?? [];
  // 2. Create the Set using the safe array reference.
  const favoriteUidSet = new Set(favoritesArray.map((fav) => fav.uid));
  // 3. Use the Set for quick lookup.
  const candidate = {
    ...post,
    isFavorited: favoriteUidSet.has(candidateId)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="hidden md:block text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300"
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
                      <Favorite
                        uid={candidate.id}
                        isFavorited={candidate.isFavorited}
                        className="w-full bg-transparent"
                        innerText="Save Profile"
                      />
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

            {/* --- VIDEO --- */}
            {ytVideoID && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <iframe
                    allowFullScreen={true}
                    // className="border-0 mt-2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    // title="Getting started | Video viewing basics"
                    // width="400"
                    // height="230"
                    src={`https://www.youtube.com/embed/${ytVideoID}?autoplay=0&amp;cc_lang_pref=en&amp;cc_load_policy=1&amp;controls=2&amp;rel=0&amp;hl=en&amp;enablejsapi=1&amp;widgetid=1&vf=6`}
                    id="widget2"
                  ></iframe>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  candidate.contact?.phones?.map((phone: string, i: number) => (
                    <div key={`phone-${i}`} className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>{phone}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>##########</span>
                    <Badge variant="destructive">
                      <CircleUserRound />
                      SignIn to see
                    </Badge>
                  </div>
                )}
                {user ? (
                  candidate.contact?.emails?.map((email: string, i: number) => (
                    <div key={`email-${i}`} className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>{email}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>##########</span>
                    <Badge variant="destructive">
                      <CircleUserRound />
                      SignIn to see
                    </Badge>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>
                    Joined{" "}
                    {new Date(
                      candidate.createdAt!.toDate()
                    ).toLocaleDateString()}
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
                {candidate.workHistory?.map(
                  (
                    work: {
                      position: string;
                      company: string;
                      duration: string;
                    },
                    index: number
                  ) => (
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
                  )
                )}
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
                {candidate.education?.map(
                  (
                    edu: { degree: string; institution: string; year: string },
                    index: number
                  ) => (
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
                      <p className="text-sm text-muted-foreground">
                        {edu.year}
                      </p>
                    </div>
                  )
                )}
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
