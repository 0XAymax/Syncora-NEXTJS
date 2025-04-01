"use client"
import { LoginForm } from "@/components/login-form";
import Logo from "@/components/Logo";
import { useTheme } from "next-themes";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme, resolvedTheme } = useTheme();
  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
          <Logo theme={theme == "light" ? "light" : "dark"} isText={true} />
          <LoginForm />
        </div>
      </div>
    </>
  );
}
