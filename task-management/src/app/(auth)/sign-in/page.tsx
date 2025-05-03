"use client";
import { LoginForm } from "@/app/(auth)/sign-in/login-form";
import Logo from "@/components/Logo";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useAuth} from "@/hooks/use-auth";
export default function Home() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if(isAuthenticated){
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);
  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
          <Logo isText={true} hasBottomGutter={true} />
          <LoginForm />
        </div>
      </div>
    </>
  );
}
