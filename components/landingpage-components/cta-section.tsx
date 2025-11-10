import { Button } from "@/components/landingpage-components/ui/button";
import { CheckCircle } from "lucide-react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const benefits = [
  "Free to start - no hidden fees",
  "AI-powered job matching",
  "Personal career coaching",
  "Exclusive job opportunities",
  "Interview preparation tools",
  "Salary negotiation support",
];

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-card rounded-3xl p-12 md:p-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Transform
            </span>
            <br />
            Your Career?
          </h2>

          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Join over 100,000 professionals who&apos;ve found their dream jobs
            through FreeJobSearcher. Start your journey today - it&apos;s
            completely free to get started.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 group" asChild>
              <Link href="/app/signup" prefetch={true}>
                Create Free Account
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 glass border-primary/20 bg-transparent"
            >
              Learn More
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Setup takes less than 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
