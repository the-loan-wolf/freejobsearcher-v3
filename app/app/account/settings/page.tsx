"use client";
import { ArrowLeft, User, Bell, Shield, Palette, Plus, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/app-components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/app-components/ui/card";
import { Input } from "@/components/app-components/ui/input";
import { Label } from "@/components/app-components/ui/label";
import { Textarea } from "@/components/app-components/ui/textarea";
import { Switch } from "@/components/app-components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/app-components/ui/select";
import { Separator } from "@/components/app-components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/app-components/ui/avatar";
import { useEffect, useState } from "react";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import {
  getAuth,
  User as firebaseuser,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "sonner";

export default function SettingsPage() {
  const [user, setUser] = useState<firebaseuser | null>(null);
  const [form, setForm] = useState({
    profile: {
      name: "example",
      role: "UI & UX Designer",
      location: "Mumbai, India",
      salary: "₹25,000",
      image: "/ui-designer-headshot.png",
      experience: "3+ years",
      bio: "Passionate UI/UX designer",
    },
    contact: {
      phones: ["+91 98765 43210"],
      emails: ["example@gmail.com"],
    },
    education: [
      { degree: "Bachelor of Design", institution: "NID", year: "2020" },
      { degree: "UX Certification", institution: "Google", year: "2021" },
    ],
    workHistory: [
      {
        company: "TechCorp",
        position: "Senior UI Designer",
        duration: "2022 - Present",
      },
      {
        company: "StartupXYZ",
        position: "UI/UX Designer",
        duration: "2021 - 2022",
      },
    ],
    achievements: [
      "Led design for app with 100K+ downloads",
      "Improved user engagement by 40%",
      "Winner of Best Design Award 2023",
    ],
    skills: ["JavaScript", "node js", "php"],
  });

  const auth = getAuth(app);

  const updateProfile = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      profile: { ...prev.profile, [key]: value },
    }));
  };

  const updateContact = (
    type: keyof typeof form.contact,
    index: number,
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...prev.contact[type]] as string[];
      updated[index] = value;
      return { ...prev, contact: { ...prev.contact, [type]: updated } };
    });
  };

  const addPhone = () => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phones: [...prev.contact.phones, ""],
      },
    }));
  };

  const removePhone = (index: number) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phones: prev.contact.phones.filter((_, i) => i !== index),
      },
    }));
  };

  const addEmail = () => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        emails: [...prev.contact.emails, ""],
      },
    }));
  };

  const removeEmail = (index: number) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        emails: prev.contact.emails.filter((_, i) => i !== index),
      },
    }));
  };

  const updateEducation = (
    index: number,
    key: keyof (typeof form.education)[number],
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateWork = (
    index: number,
    key: keyof (typeof form.workHistory)[number],
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...prev.workHistory];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, workHistory: updated };
    });
  };

  const removeWork = (index: number) => {
    setForm((prev) => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index),
    }));
  };

  const updateSkills = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.skills];
      updated[index] = value;
      return { ...prev, skills: updated };
    });
  };

  const removeSkill = (index: number) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const updateAchievements = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.achievements];
      updated[index] = value;
      return { ...prev, achievements: updated };
    });
  };

  const removeAchievement = (index: number) => {
    setForm((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };

  const addWork = () => {
    setForm((prev) => ({
      ...prev,
      workHistory: [
        ...prev.workHistory,
        { company: "", position: "", duration: "" },
      ],
    }));
  };

  const addAchievement = () => {
    setForm((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }));
  };

  const addSkill = () => {
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const handleSubmit = () => {
    // console.log("Final form state:", form);
    const db = getFirestore(app);
    if (user) {
      const docRef = doc(db, "resumes", user.uid);
      try {
        setDoc(docRef, { ...form, createdAt: serverTimestamp() });
        toast.success("resumes saved successfully");
      } catch (error) {
        console.error("Error during saving resume:", error);
        toast.error("Failed to sign out. Try again.");
      }
    }
  };

  // Listen for Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, [auth]);

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

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="space-y-8">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/user-avatar.jpg" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                    />
                  </div>
                </div>

                {form.contact.phones.map((p, i) => (
                  <div className="space-y-2" key={i}>
                    {/* ADDED unique htmlFor/id */}
                    <Label htmlFor={`phone-${i}`}>Phone #{i + 1}</Label>
                    {/* ADDED  */}
                    <div className="flex items-center space-x-2">
                      <Input
                        id={`phone-${i}`}
                        value={p}
                        onChange={(e) =>
                          updateContact("phones", i, e.target.value)
                        }
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePhone(i)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addPhone}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Phone
                </Button>

                {form.contact.emails.map((p, i) => (
                  <div className="space-y-2" key={i}>
                    {/* ADDED unique htmlFor/id */}
                    <Label htmlFor={`email-${i}`}>Email #{i + 1}</Label>
                    {/* ADDED  */}
                    <div className="flex items-center space-x-2">
                      <Input
                        id={`email-${i}`}
                        type="email"
                        value={p}
                        onChange={(e) =>
                          updateContact("emails", i, e.target.value)
                        }
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmail(i)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addEmail}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={form.profile.location}
                    onChange={(e) => updateProfile("location", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={form.profile.role}
                    onChange={(e) => updateProfile("role", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={form.profile.bio}
                    onChange={(e) => updateProfile("bio", e.target.value)}
                  />
                </div>

                {/* EDUCATION */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {form.education.map((edu, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`degree-${i}`}>Degree</Label>
                            <Input
                              id={`degree-${i}`}
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(i, "degree", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`institution-${i}`}>
                              Institution
                            </Label>
                            <Input
                              id={`institution-${i}`}
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(
                                  i,
                                  "institution",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`year-${i}`}>Year</Label>
                            <Input
                              id={`year-${i}`}
                              value={edu.year}
                              onChange={(e) =>
                                updateEducation(i, "year", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEducation(i)}
                          className="mt-6" // Align button roughly with inputs
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={addEducation}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  </CardContent>
                </Card>

                {/* WORK */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Work History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {form.workHistory.map((job, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`company-${i}`}>Company</Label>
                            <Input
                              id={`company-${i}`}
                              value={job.company}
                              onChange={(e) =>
                                updateWork(i, "company", e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`position-${i}`}>Position</Label>
                            <Input
                              id={`position-${i}`}
                              value={job.position}
                              onChange={(e) =>
                                updateWork(i, "position", e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`duration-${i}`}>Duration</Label>
                            <Input
                              id={`duration-${i}`}
                              value={job.duration}
                              onChange={(e) =>
                                updateWork(i, "duration", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeWork(i)}
                          className="mt-6" // Align button roughly with inputs
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={addWork}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Work History
                    </Button>
                  </CardContent>
                </Card>

                {/* ACHIEVEMENTS */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {form.achievements.map((a, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Input
                          value={a}
                          onChange={(e) =>
                            updateAchievements(i, e.target.value)
                          }
                          className="flex-grow"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement(i)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={addAchievement}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Achievement
                    </Button>
                  </CardContent>
                </Card>

                {/* SKILLS */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {form.skills.map((s, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Input
                          value={s}
                          onChange={(e) => updateSkills(i, e.target.value)}
                          className="flex-grow"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(i)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={addSkill}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Skill
                    </Button>
                  </CardContent>
                </Card>
                <div className="mt-8">
                  <Button size="lg" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Job Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new job opportunities
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Profile Views</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone views your profile
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and tips
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="visibility">Profile Visibility</Label>
                  <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        Public - Anyone can view
                      </SelectItem>
                      <SelectItem value="registered">
                        Registered users only
                      </SelectItem>
                      <SelectItem value="private">
                        Private - Only you
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Contact Information</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your contact details
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button variant="outline">Update Password</Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific Standard Time</SelectItem>
                      <SelectItem value="est">Eastern Standard Time</SelectItem>
                      <SelectItem value="cst">Central Standard Time</SelectItem>
                      <SelectItem value="mst">
                        Mountain Standard Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
