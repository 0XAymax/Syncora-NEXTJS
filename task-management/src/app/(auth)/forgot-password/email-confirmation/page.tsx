"use client";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import { codeVerificationAPI, resetPassAPI } from "@/app/_api/ResetPassAPIs";
import { toast } from "sonner";
function EmailConfirmation() {
  const codeRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codeRef.current?.value;
    if (!code) {
      toast.error("Code Verification is required");
      return;
    }
    if (!email) {
      toast.error("Error while sending email address");
      return;
    }
    try {
      const verificationResponse = await codeVerificationAPI(email, code);
      if (verificationResponse.data.message) {
        const resetResponse = await resetPassAPI(email);
        const token = resetResponse.data.token;
        localStorage.setItem("resetToken", token);
        window.location.href = "/forgot-password/reset-password/";
      } else {
        toast.error("Failed to verify the code. Please try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response) {
        toast.error(
          err.response?.data?.error ||
            "Failed to verify the code. Please try again."
        );
      } else if (err.request) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }

      toast.error("Verification or reset error:", err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Enter Verification Code
        </h2>
        <p className="text-muted-foreground text-sm text-center mb-6">
          A verification code has been sent to your email address. Please check
          your inbox and enter the 6-digit code below to proceed.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <input
              type="text"
              ref={codeRef}
              className="w-full p-3 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tag-blue"
              placeholder="Enter 6-digit code"
            />
          </div>
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
}

export default EmailConfirmation;
