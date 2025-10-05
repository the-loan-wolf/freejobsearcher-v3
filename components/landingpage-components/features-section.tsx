import { Card, CardContent } from "@/components/landingpage-components/ui/card";
import { Zap, Target, Shield, Rocket, Brain, Heart } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Our advanced AI analyzes your skills, experience, and preferences to find the perfect job matches.",
  },
  {
    icon: Zap,
    title: "Instant Applications",
    description:
      "Apply to multiple jobs with one click using your optimized profile and tailored cover letters.",
  },
  {
    icon: Target,
    title: "Precision Targeting",
    description:
      "Get matched only with jobs that align with your career goals and salary expectations.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data is secure and private. Control who sees your profile and when.",
  },
  {
    icon: Rocket,
    title: "Career Acceleration",
    description:
      "Access exclusive opportunities and fast-track your career with premium job listings.",
  },
  {
    icon: Heart,
    title: "Personal Support",
    description:
      "Get dedicated career coaching and interview preparation from industry experts.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FreeJobSearcher
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            We&apos;ve revolutionized job searching with cutting-edge technology
            and personalized support to help you land your dream role faster
            than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass-card border-0 hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="p-8">
                <feature.icon className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-pretty">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
