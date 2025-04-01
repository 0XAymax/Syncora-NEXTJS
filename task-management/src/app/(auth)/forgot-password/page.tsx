"use client";
import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default function ForgotPassowrd() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const hanleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email=emailRef.current?.value;
    try{
      const res =await axios.post("http://localhost:3001/api/auth/emailCheck",{
        email : email
      });
      if(!res.data.user){
        setError("Email not registered");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/auth/reset-pass",
        { email  : email}
      );
      const token = response.data.token;

      window.location.href = `/forgot-password/reset-password?token=${token}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
      console.error("Email check error:", err);
      setError("Failed to verify email. Please try again.");
      return;
    }


    
}
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={hanleSubmit}>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            <p>
              Enter your email address to get instructions for resetting your
              password.
            </p>
          </CardDescription>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </CardHeader>
        <CardContent>
          <label>Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            ref={emailRef}
            required
          ></Input>
        </CardContent>
        <CardFooter className="mt-auto">
          <div className="cursor-pointer">
            <Button type="submit">
              Reset
            </Button>
          </div>
        </CardFooter>
      </Card>
      </form>
    </div>
  );
}

