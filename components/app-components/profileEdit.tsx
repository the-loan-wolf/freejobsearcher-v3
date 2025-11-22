import { User, Plus, X } from "lucide-react";
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
import { FormEvent, useState } from "react";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import { User as firebaseuser } from "firebase/auth";
import { toast } from "sonner";
import ProfilePicUpload from "@/components/app-components/ProfilePicUpload";
import { ResumeType } from "@/lib/types";
import VideoIntro from "./VideoIntro";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProfileEdit({
  initialData,
  user,
}: {
  initialData: ResumeType;
  user: firebaseuser;
}) {
  /* --- STATES --- */
  const [form, setForm] = useState<ResumeType>(initialData);
  const [videoExist, setVideoExist] = useState(false);

  // Get the query client
  const queryClient = useQueryClient();

  /* --- HANDLERS --- */
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

  const addLink = (vid: string) => {
    setForm((prev) => ({ ...prev, ytVid: vid }));
  };

  /* --- MUTATION LOGIC --- */

  // 5. Define the async function that does the saving
  const saveResumeToFirebase = async (formData: ResumeType) => {
    const db = getFirestore(app);
    const docRef = doc(db, "resumes", user.uid);

    const dataToSave = {
      ...formData,
      createdAt: serverTimestamp(),
      ytVid: videoExist ? formData.ytVid : "",
    };

    await setDoc(docRef, dataToSave, { merge: true });
    return dataToSave; // Return the saved data (optional)
  };

  // 6. Create the mutation hook
  const { mutate: saveResume, isPending: isSaving } = useMutation({
    mutationFn: saveResumeToFirebase,
    onSuccess: () => {
      // 7. THE MAGIC: Invalidate the parent's query
      // This key MUST match the useQuery key in page.tsx
      queryClient.invalidateQueries({ queryKey: [user.uid] });
      toast.success("Resume saved successfully");
    },
    onError: (error) => {
      console.error("Error during saving resume:", error);
      toast.error("Failed to save resume. Try again.");
    },
  });

  // 8. Update handleSubmit to use the mutation
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // We already know user exists from parent component logic
    saveResume(form); // Pass the current local state to the mutation
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Profile Settings */}
            <form onSubmit={handleSubmit}>
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
                  <ProfilePicUpload setParentUrlState={updateProfile} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        required
                        value={form.profile.name}
                        onChange={(e) => updateProfile("name", e.target.value.toLowerCase())}
                      />
                    </div>
                  </div>

                  <div className="space-x-2 space-y-2">
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
                              updateContact("phones", i, e.target.value.toLowerCase())
                            }
                            className="flex-grow"
                          />
                          <Button
                            type="button"
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
                      type="button"
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
                              updateContact("emails", i, e.target.value.toLowerCase())
                            }
                            className="flex-grow"
                          />
                          <Button
                            type="button"
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
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addEmail}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Email
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      required
                      value={form.profile.location}
                      onChange={(e) =>
                        updateProfile("location", e.target.value.toLowerCase())
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Job Title<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      required
                      value={form.profile.role}
                      onChange={(e) => updateProfile("role", e.target.value.toLowerCase())}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      experience<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="experience"
                      required
                      value={form.profile.experience}
                      onChange={(e) =>
                        updateProfile("experience", e.target.value.toLowerCase())
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">
                      Salary(₹)<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      id="salary"
                      value={form.profile.salary}
                      onChange={(e) => updateProfile("salary", e.target.value.toLowerCase())}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={form.profile.bio}
                      onChange={(e) => updateProfile("bio", e.target.value.toLowerCase())}
                    />
                  </div>

                  <VideoIntro
                    vid={form.ytVid}
                    setVid={addLink}
                    verified={videoExist}
                    setVerified={setVideoExist}
                  />

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
                                  updateEducation(i, "degree", e.target.value.toLowerCase())
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
                                    e.target.value.toLowerCase(),
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
                                  updateEducation(i, "year", e.target.value.toLowerCase())
                                }
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
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
                        type="button"
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
                                  updateWork(i, "company", e.target.value.toLowerCase())
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`position-${i}`}>Position</Label>
                              <Input
                                id={`position-${i}`}
                                value={job.position}
                                onChange={(e) =>
                                  updateWork(i, "position", e.target.value.toLowerCase())
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`duration-${i}`}>Duration<span className="text-red-500">*</span></Label>
                              <Input
                                required
                                id={`duration-${i}`}
                                value={job.duration}
                                onChange={(e) =>
                                  updateWork(i, "duration", e.target.value.toLowerCase())
                                }
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
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
                        type="button"
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
                              updateAchievements(i, e.target.value.toLowerCase())
                            }
                            className="flex-grow"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAchievement(i)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
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
                            required
                            onChange={(e) => updateSkills(i, e.target.value.toLowerCase())}
                            className="flex-grow"
                          />
                          <span className="text-red-500">*</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSkill(i)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
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
                    <Button size="lg" type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
