"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Upload, User} from "lucide-react";
import {useEdgeStore} from "@/lib/edgestore";
import Logo from "@/components/Logo";
export function SignUpForm({
                             className,
                             ...props
                           }: React.ComponentProps<"form">) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { register, checkEmail } = useAuth();
  const [file,setFile] = useState<File>();
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const { edgestore } = useEdgeStore();
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setUploading(true);
    try {
      const res = await edgestore.publicFiles.upload({ file : selectedFile});
      setAvatarSrc(res.url);
      setFile(selectedFile);
      console.log("AVATAR URL",avatarSrc);
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error("Failed to upload avatar.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const lastName = lastnameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!name || !lastName || !email || !password) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const res = await checkEmail(email);

      if (res.data.user) {
        toast.error("Email is already in use");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("Email check error:", err);
      toast.error("Failed to verify email. Please try again.");
      return;
    }

    try {
      const response = await register(email, name, lastName, password,avatarSrc);

      console.log("User registered:", response.data);
      toast.success("Registered successfully");
      router.push("/sign-in");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(
          err.response ? err.response.data.message : "Registration failed."
      );
    }
  };

  return (
      <form
          className={cn("w-full max-w-md mx-auto rounded-lg border border-border p-6 shadow-sm", className)}
          onSubmit={handleSubmit}
          {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <Logo isText={true} hasBottomGutter={true} />
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your information below to create your account
          </p>
        </div>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group cursor-pointer" onClick={triggerFileInput}>
            <Avatar className="w-24 h-24 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
              <AvatarImage src={avatarSrc || ""} />
              <AvatarFallback className="bg-muted">
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <input type="file" ref={fileInputRef}  className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Click to upload avatar</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input id="name" type="text" placeholder="John" ref={nameRef} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input id="lastname" type="text" placeholder="Doe" ref={lastnameRef} required />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" ref={emailRef} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" ref={passwordRef} required />
          </div>

          <Button type="submit" className="w-full mt-2">
            Create Account
          </Button>
        </div>

        <div className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline underline-offset-4 font-medium">
            Sign In
          </Link>
        </div>
      </form>
  );
}
