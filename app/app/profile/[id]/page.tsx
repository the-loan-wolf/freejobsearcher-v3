import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Star, Mail, Phone, Calendar, Award, Briefcase, GraduationCap } from "lucide-react"
import { Button } from "@/components/app-components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/app-components/ui/card"
import { Badge } from "@/components/app-components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/app-components/ui/avatar"
import Link from "next/link"

// Extended candidate data with detailed information
const candidatesData = [
  {
    id: 1,
    name: "Sandhya singh",
    role: "UI & UX Designer",
    location: "Mumbai, India",
    salary: "₹25,000",
    image: "/ui-designer-headshot.png",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Design Systems"],
    experience: "3+ years",
    email: "sandhyasingh@email.com",
    phone: "+91 98765 43210",
    joinedDate: "2021-03-15",
    bio: "Passionate UI/UX designer with a keen eye for detail and user-centered design approach. I specialize in creating intuitive digital experiences that solve real user problems.",
    education: [
      { degree: "Bachelor of Design", institution: "National Institute of Design", year: "2020" },
      { degree: "UX Design Certification", institution: "Google", year: "2021" },
    ],
    workHistory: [
      { company: "TechCorp Solutions", position: "Senior UI Designer", duration: "2022 - Present" },
      { company: "StartupXYZ", position: "UI/UX Designer", duration: "2021 - 2022" },
    ],
    achievements: [
      "Led design for mobile app with 100K+ downloads",
      "Improved user engagement by 40% through redesign",
      "Winner of Best Design Award 2023",
    ],
  },
  {
    id: 2,
    name: "Vikas Kumar",
    role: "Software Developer",
    location: "Bangalore, India",
    salary: "₹10,000",
    image: "/software-developer-headshot.png",
    skills: ["React", "Node.js", "Python", "MongoDB", "AWS", "Docker"],
    experience: "2+ years",
    email: "vikas.kumar@email.com",
    phone: "+91 87654 32109",
    joinedDate: "2022-01-10",
    bio: "Full-stack developer passionate about building scalable web applications. I enjoy working with modern technologies and solving complex technical challenges.",
    education: [
      { degree: "B.Tech Computer Science", institution: "IIT Bangalore", year: "2021" },
      { degree: "AWS Certification", institution: "Amazon", year: "2022" },
    ],
    workHistory: [
      { company: "DevTech Solutions", position: "Software Developer", duration: "2022 - Present" },
      { company: "CodeCraft", position: "Junior Developer", duration: "2021 - 2022" },
    ],
    achievements: [
      "Optimized database queries reducing load time by 60%",
      "Built microservices architecture for e-commerce platform",
      "Mentored 5 junior developers",
    ],
  },
  {
    id: 3,
    name: "Shristi kumari",
    role: "Full Stack Developer",
    location: "Delhi, India",
    salary: "₹50,000",
    image: "/professional-headshot-of-full-stack-developer.jpg",
    skills: ["JavaScript", "MongoDB", "Express", "React", "Next.js", "TypeScript"],
    experience: "5+ years",
    email: "shristikumari@email.com",
    phone: "+91 76543 21098",
    joinedDate: "2019-06-20",
    bio: "Senior full-stack developer with expertise in modern web technologies. I have a proven track record of delivering high-quality applications and leading development teams.",
    education: [
      { degree: "M.Tech Software Engineering", institution: "Delhi University", year: "2018" },
      { degree: "B.Tech Computer Science", institution: "Delhi University", year: "2016" },
    ],
    workHistory: [
      { company: "TechGiant Corp", position: "Senior Full Stack Developer", duration: "2020 - Present" },
      { company: "WebSolutions Inc", position: "Full Stack Developer", duration: "2018 - 2020" },
    ],
    achievements: [
      "Architected and built 10+ production applications",
      "Led team of 8 developers on major project",
      "Reduced deployment time by 80% with CI/CD implementation",
    ],
  },
  {
    id: 4,
    name: "Ashish Raj",
    role: "Doctor",
    location: "Chennai, India",
    salary: "₹12,000",
    image: "/doctor-headshot.png",
    skills: ["General Medicine", "Patient Care", "Emergency Medicine", "Diagnosis"],
    experience: "4+ years",
    email: "dr.ashish@email.com",
    phone: "+91 65432 10987",
    joinedDate: "2020-08-01",
    bio: "Dedicated medical professional committed to providing excellent patient care. Experienced in general medicine with a focus on preventive healthcare and patient education.",
    education: [
      { degree: "MBBS", institution: "All India Institute of Medical Sciences", year: "2019" },
      { degree: "Emergency Medicine Certification", institution: "Medical Council of India", year: "2020" },
    ],
    workHistory: [
      { company: "City General Hospital", position: "Resident Doctor", duration: "2020 - Present" },
      { company: "Community Health Center", position: "Medical Officer", duration: "2019 - 2020" },
    ],
    achievements: [
      "Treated 1000+ patients with 98% satisfaction rate",
      "Implemented new patient care protocols",
      "Published research on preventive medicine",
    ],
  },
  {
    id: 5,
    name: "Kartik sharma",
    role: "Account Manager",
    location: "Pune, India",
    salary: "₹30,000",
    image: "/professional-headshot-of-account-manager.jpg",
    skills: ["Client Relations", "Sales", "CRM", "Project Management", "Business Development"],
    experience: "3+ years",
    email: "kartiksharma@email.com",
    phone: "+91 54321 09876",
    joinedDate: "2021-11-15",
    bio: "Results-driven account manager with a strong background in client relationship management and business development. Passionate about helping clients achieve their goals.",
    education: [
      { degree: "MBA Marketing", institution: "Pune University", year: "2020" },
      { degree: "B.Com", institution: "Pune University", year: "2018" },
    ],
    workHistory: [
      { company: "BusinessPro Solutions", position: "Senior Account Manager", duration: "2022 - Present" },
      { company: "ClientFirst Corp", position: "Account Manager", duration: "2021 - 2022" },
    ],
    achievements: [
      "Managed portfolio worth ₹50L+ annually",
      "Achieved 120% of sales targets for 2 consecutive years",
      "Retained 95% of key clients",
    ],
  },
]

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const candidateId = Number.parseInt(params.id)
  const candidate = candidatesData.find((c) => c.id === candidateId)

  if (!candidate) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/app">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Profile Details</h1>
            </div>
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
                    <AvatarImage src={candidate.image || "/placeholder.svg"} alt={candidate.name} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">{candidate.name}</h2>
                    <p className="text-lg text-primary font-medium">{candidate.role}</p>

                    <div className="flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {candidate.location}
                    </div>

                    <div className="flex items-center justify-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {candidate.experience}
                    </div>
                  </div>

                  <div className="w-full pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Expected Salary</span>
                      <span className="font-bold text-xl text-primary">{candidate.salary}</span>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Candidate
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
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
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{candidate.bio}</p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Joined {new Date(candidate.joinedDate).toLocaleDateString()}</span>
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
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
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
                {candidate.workHistory.map((work, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-semibold text-foreground">{work.position}</h4>
                    <p className="text-primary font-medium">{work.company}</p>
                    <p className="text-sm text-muted-foreground">{work.duration}</p>
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
                {candidate.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                    <p className="text-primary font-medium">{edu.institution}</p>
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
                  {candidate.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{achievement}</span>
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
