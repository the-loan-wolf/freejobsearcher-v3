"use client"

import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, Edit } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/app-components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/app-components/ui/card"
import { Badge } from "@/components/app-components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/app-components/ui/avatar"
import { Separator } from "@/components/app-components/ui/separator"

export default function UserProfilePage() {
  // Mock user data - in a real app this would come from authentication/database
  const user = {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: "/user-avatar.jpg",
    title: "Senior Full Stack Developer",
    company: "Tech Solutions Inc.",
    joinDate: "January 2020",
    bio: "Passionate full-stack developer with 8+ years of experience building scalable web applications. I specialize in React, Node.js, and cloud technologies, with a strong focus on user experience and performance optimization.",
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL"],
    experience: [
      {
        title: "Senior Full Stack Developer",
        company: "Tech Solutions Inc.",
        period: "2020 - Present",
        description: "Lead development of enterprise web applications serving 100k+ users",
      },
      {
        title: "Full Stack Developer",
        company: "StartupXYZ",
        period: "2018 - 2020",
        description: "Built and maintained multiple client projects using modern web technologies",
      },
      {
        title: "Frontend Developer",
        company: "Digital Agency",
        period: "2016 - 2018",
        description: "Developed responsive websites and web applications for various clients",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        year: "2016",
      },
    ],
    achievements: [
      "AWS Certified Solutions Architect",
      "Led team of 5 developers on major product launch",
      "Reduced application load time by 40%",
      "Mentored 10+ junior developers",
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/app"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold text-foreground mb-1">{user.name}</h1>
                  <p className="text-primary font-medium mb-2">{user.title}</p>
                  <p className="text-muted-foreground text-sm">{user.company}</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-foreground">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-foreground">{user.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-foreground">{user.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-foreground">Joined {user.joinDate}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <Button className="w-full" asChild>
                  <Link href="/app/account/settings">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
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
                <p className="text-foreground leading-relaxed">{user.bio}</p>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
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
                {user.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                    <p className="text-foreground">{exp.description}</p>
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
                    <p className="text-primary font-medium">{edu.school}</p>
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
      </div>
    </div>
  )
}
