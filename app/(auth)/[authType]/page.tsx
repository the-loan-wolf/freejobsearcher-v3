"use client";

import { notFound, useParams } from "next/navigation";
import RecoverPasswordPage from "@/components/app-components/recover-password";
import SignUpPage from "@/components/app-components/signup";
import SignInPage from "@/components/app-components/signin";

export default function AuthPage() {
  const { authType } = useParams(); // "signin" or "signup" or "recover"

  switch (authType) {
    case "signin":
      return <SignInPage />;
    case "signup":
      return <SignUpPage />;
    case "recover-password":
      return <RecoverPasswordPage />;
    default:
      notFound();
  }
}
