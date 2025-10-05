"use client";

import { Button } from "@/components/landingpage-components/ui/button";
import { Briefcase, Users, TrendingUp } from "lucide-react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6">
              Land Your{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />
              In Record Time
            </h1>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Join thousands of professionals who&apos;ve accelerated their careers
              with our AI-powered job matching platform. Create your profile
              today and get matched with opportunities that fit your skills
              perfectly.
            </p>
          </div>

          <div
            className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center mb-12"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/app/login" prefetch={true}>
              <Button size="lg" className="text-lg px-8 py-6 group">
                Create Your Profile
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/app" prefetch={true}>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 glass-card bg-transparent"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>

          <div
            className="animate-slide-in-right grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="glass-card rounded-xl p-6 text-center">
              <Briefcase className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-muted-foreground">Active Jobs</div>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">100K+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
