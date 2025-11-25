
export interface JobCategory {
  category: string
  jobs: string[]
}

export const jobData: JobCategory[] = [
  {
    category: "Software & IT",
    jobs: [
      "Software Engineer",
      "Web Developer",
      "Mobile Developer",
      "QA / Tester",
      "DevOps Engineer",
      "Data Scientist",
      "Data Analyst",
      "Cloud Engineer",
      "Cybersecurity Specialist",
    ],
  },
  {
    category: "Product & Design",
    jobs: ["Product Manager", "UX Designer", "UI Designer", "Graphic Designer", "UX Researcher", "Product Owner"],
  },
  {
    category: "Sales & Marketing",
    jobs: [
      "Sales Executive",
      "Sales Manager",
      "Digital Marketer",
      "SEO Specialist",
      "Content Writer",
      "Social Media Manager",
      "Growth Marketer",
    ],
  },
  {
    category: "Business & Operations",
    jobs: [
      "Business Analyst",
      "Project Manager",
      "Operations Manager",
      "Supply Chain Specialist",
      "Procurement Officer",
    ],
  },
  {
    category: "Finance & Accounting",
    jobs: ["Accountant", "Financial Analyst", "Auditor", "Bookkeeper", "Tax Consultant"],
  },
  {
    category: "Human Resources",
    jobs: ["HR Manager", "Recruiter", "Talent Acquisition Specialist", "HR Generalist"],
  },
  {
    category: "Customer Support",
    jobs: ["Customer Support Agent", "Technical Support Specialist", "Customer Success Manager"],
  },
  {
    category: "Engineering (Non-IT)",
    jobs: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer"],
  },
  {
    category: "Healthcare",
    jobs: ["Nurse", "Doctor", "Pharmacist", "Lab Technician"],
  },
  {
    category: "Education",
    jobs: ["Teacher", "Instructor", "Tutor", "Academic Coordinator"],
  },
]
