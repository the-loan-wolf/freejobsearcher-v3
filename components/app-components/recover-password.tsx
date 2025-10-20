"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/app-components/ui/button";
import { Input } from "@/components/app-components/ui/input";
import { Card } from "@/components/app-components/ui/card";
import { toast } from "sonner";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/lib/firebaseLib";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const auth = getAuth(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    //Add your password recovery logic here
    try {
      sendPasswordResetEmail(auth, email);
      setIsLoading(false);
      toast.success("Email sent!");
      setSubmitted(true);
    } catch (error) {
      toast.error("Email not sent!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <div className="p-8">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Reset password
                </h1>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a link to reset
                  your password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>

              {/* Back to sign in */}
              <div className="mt-6 text-center">
                <Link
                  href="/app/signin"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Check your email
                </h2>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Click the link in the email to reset your password. If you
                  don't see it, check your spam folder.
                </p>

                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full mb-3"
                >
                  Try another email
                </Button>

                <Link href="/app/signin" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
