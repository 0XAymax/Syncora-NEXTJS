"use client";
import { SignUpForm } from "@/app/(auth)/sign-up/sign-up";
import Logo from "@/components/Logo";
import { useTheme } from "next-themes";

export default function SignUp() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme, resolvedTheme } = useTheme();
  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
          <Logo isText={true} />
          <SignUpForm />
        </div>
      </div>
    </>
  );
}
