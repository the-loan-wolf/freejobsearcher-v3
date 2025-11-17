"use client";

import { AlertCircleIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/app-components/ui/button";
import { useState } from "react";
import ProfileEdit from "@/components/app-components/profileEdit";
import ProfileView from "@/components/app-components/profileView";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import fetchCandidate from "@/lib/fetchCandidate";
import ProfileSkeleton from "@/components/app-components/profileSkeleton";
import { Spinner } from "@/components/app-components/ui/spinner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/app-components/ui/alert";

export default function UserProfilePage() {
  const [view, setView] = useState(true);
  const { user, loading: isAuthLoading } = useAuth();
  const userId = user?.uid;
  const {
    data: form,
    isLoading: isProfileLoading,
    isError,
  } = useQuery({
    queryKey: [userId],
    queryFn: () => fetchCandidate(userId!),
    enabled: !!userId,
  });

  // --- Render Logic ---

  // State 1: Auth is checking (show a simple, page-wide loader)
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="size-auto" />
      </div>
    );
  }

  // State 2: Auth is done, but there is no user
  // (Show this *before* the profile loading check)
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please sign in to view your profile.
      </div>
    );
  }

  // State 3: Auth is done, user exists, but profile is loading
  // (This is the *only* time to show the skeleton)
  if (isProfileLoading) {
    return <ProfileSkeleton />;
  }

  // State 4: Auth is done, user exists, but profile fetch failed
  let emptyForm = {
    profile: {
      name: "",
      role: "",
      location: "",
      salary: "",
      image: "",
      experience: "",
      bio: "",
    },
    contact: { phones: [""], emails: [""] },
    education: [{ degree: "", institution: "", year: "" }],
    workHistory: [{ company: "", position: "", duration: "" }],
    achievements: [""],
    skills: [""],
    createdAt: null,
    ytVid: "",
    id: "",
    isFavorited: false,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          {view ? (
            <Link
              href="/app"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          ) : (
            <Button variant="ghost" onClick={() => setView(true)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Resume Empty</AlertTitle>
              <AlertDescription>
                Add your details to get your resume started.
              </AlertDescription>
            </Alert>
          )}

          {view ? (
            <ProfileView setView={setView} user={form || emptyForm} />
          ) : (
            <ProfileEdit initialData={form || emptyForm} user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
