"use client";
import { SignUpForm } from "@/app/(auth)/sign-up/sign-up";

export default function SignUp() {
  return (
    <>
      <div className="flex items-center flex-col justify-center min-h-screen p-24">
          <SignUpForm />
      </div>
    </>
  );
}
