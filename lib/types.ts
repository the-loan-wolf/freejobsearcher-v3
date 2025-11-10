export type ResumeType = {
  profile: {
    name: string;
    role: string;
    location: string;
    salary: string;
    image: string;
    experience: string;
    bio: string;
  };
  contact: {
    phones: string[];
    emails: string[];
  };
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  workHistory: {
    company: string;
    position: string;
    duration: string;
  }[];
  achievements: string[];
  skills: string[];
}
