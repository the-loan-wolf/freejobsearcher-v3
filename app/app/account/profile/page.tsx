"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/app-components/ui/button";
import { useEffect, useState } from "react";
import ProfileEdit from "@/components/app-components/profileEdit";
import ProfileView from "@/components/app-components/profileView";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import { ResumeType } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

const db = getFirestore(app);

export default function UserProfilePage() {
  const [view, setView] = useState(true);
  const { user } = useAuth();
  const [form, setForm] = useState<ResumeType>({
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
  });

  /* --- EFFECTS --- */

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // User is guaranteed non-null here, so we can use user.uid
          const docRef = doc(db, "resumes", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Set the form state
            setForm(docSnap.data() as ResumeType);
          } else {
            // Document does not exist (e.g., new user)
            console.log("No resume document found. Using default form state.");
          }
        } catch (error) {
          // Log any errors that occurred during the process
          console.error("Failed to fetch user resume data:", error);
        }
      };
      fetchData();
    }
  }, [user, db]);

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

          {view ? (
            <ProfileView setView={setView} user={form} />
          ) : (
            <ProfileEdit form={form} setForm={setForm} user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
