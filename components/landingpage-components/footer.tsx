import { Briefcase } from "lucide-react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="glass-card border-t-0 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Briefcase className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold text-primary">
                FreeJobSearcher
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md text-pretty">
              Revolutionizing job search with AI-powered matching and
              personalized career support. Your dream job is just a click away.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-muted-foreground">
                <EnvelopeClosedIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">hello@FreeJobSearcher.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/app"
                  prefetch={true}
                  className="hover:text-primary transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Career Coaching
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Resume Builder
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>
            &copy; 2025 FreeJobSearcher. All rights reserved. Built with ❤️ for
            job seekers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
