import { Timestamp } from "firebase/firestore";

export type ResumeType = {
  profile: {
    name: string;
    role: string;
    address: string;
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
  createdAt: Timestamp | null;
  ytVid: string;
  id: string;
  isFavorited: boolean;
  categories: string[];
};
