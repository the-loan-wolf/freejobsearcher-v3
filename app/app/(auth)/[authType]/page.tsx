"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const { authType } = useParams(); // "signin" or "signup"

  const isSignUp = authType === "signup";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-center">
        {isSignUp ? "Create an Account" : "Welcome Back"}
      </h1>

      <form className="flex flex-col gap-3">
        {isSignUp && (
          <input
            type="text"
            placeholder="Username"
            className="p-2 border rounded-md"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded-md"
        />

        <button className="bg-blue-600 text-white py-2 rounded-md cursor-pointer hover:bg-blue-700 transition">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <div className="text-center text-sm mt-2">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/app/signin" className="text-blue-600 underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <Link href="/app/signup" className="text-blue-600 underline">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
