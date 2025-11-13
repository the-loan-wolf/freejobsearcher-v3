import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Hammer,
  Calendar,
  Video,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dispatch, SetStateAction } from "react";
import { ResumeType } from "@/lib/types";

export default function ProfileView({
  setView,
  user,
}: {
  setView: Dispatch<SetStateAction<boolean>>;
  user: ResumeType;
}) {
  // 1. Timestamp object from Firestore
  const firestoreTimestamp = user.createdAt; // e.g., { seconds: 1678886400, nanoseconds: 0 }
  // 2. Convert it to a standard JavaScript Date
  let userdate = "";
  if (firestoreTimestamp) {
    const jsDate = firestoreTimestamp.toDate();
    userdate = jsDate.toLocaleDateString();
  }

  let ytVideoID: string | null = "";

  if (user.ytVid) {
    const url = new URL(user.ytVid).searchParams;
    ytVideoID = url.get("v");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
      {/* Profile Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage
                  src={user.profile.image || "/placeholder.svg"}
                  alt={user.profile.name}
                />
                <AvatarFallback className="text-lg">
                  {user.profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {user.profile.name}
              </h1>
              <p className="text-primary font-medium mb-2">
                {user.workHistory[0].position}
              </p>
              <p className="text-muted-foreground text-sm">
                {user.workHistory[0].company}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              {user.contact?.emails?.map((email: any, i: number) => (
                <div key={`phone-${i}`} className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                  <span className="text-foreground">{email}</span>
                </div>
              ))}
              {user.contact?.phones?.map((phone: any, i: number) => (
                <div key={`phone-${i}`} className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                  <span className="text-foreground">{phone}</span>
                </div>
              ))}
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mr-3" />
                <span className="text-foreground">{user.profile.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground mr-3" />
                <span className="text-foreground">Joined {userdate}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <Button className="w-full" onClick={() => setView(false)}>
              Edit profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {user.profile.bio}
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

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Hammer className="mr-2 h-5 w-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user.workHistory.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <h3 className="font-semibold text-foreground">
                  {exp.position}
                </h3>
                <p className="text-primary font-medium">{exp.company}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {exp.duration}
                </p>
                {/* <p className="text-foreground">{exp.description}</p> */}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                <p className="text-primary font-medium">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.year}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {user.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-foreground">{achievement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
