"use client"
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modeToggle";
import Link from "next/link";
import React from "react";
import {useAuth} from "@/hooks/use-auth";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <header className="flex justify-between items-center h-16 py-3 px-5.5 border-border border-b-1">
        <Logo height={32} width={110} isText={true} />
        <div className="flex gap-4">
          <Link href="/sign-up">
            <Button variant="outline">Sign Up</Button>
          </Link>
          {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Sign In</Button>
              </Link>
          ):(
              <Link href="/sign-in">
                <Button>Sign In</Button>
              </Link>
          )}
          <ModeToggle />
        </div>
      </header>

      {children}

      <footer className="flex flex-col justify-between gap-4 py-6 border-border border-t-1">
        <div className="flex justify-between flex-wrap px-5.5">
          <div>
            <Logo height={32} width={110} isText={true} />
            <p>A simplified task manager.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="w-36">
              <p className="typography-large">Learn</p>
              <ul className="flex flex-col gap-2 mt-2">
                <li>
                  <Link href="#">Guides</Link>
                </li>
                <li>
                  <Link href="#">Tutorials</Link>
                </li>
              </ul>
            </div>
            <div className="w-36">
              <p className="typography-large">Resources</p>
              <ul className="flex flex-col gap-2 mt-2">
                <li>
                  <Link href="#">Documentation</Link>
                </li>
                <li>
                  <Link href="#">Github</Link>
                </li>
              </ul>
            </div>
            <div className="w-36">
              <p className="typography-large">Legal</p>
              <ul className="flex flex-col gap-2 mt-2">
                <li>
                  <Link href="#">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center p-4 border-t-1 border-border">
          <p className="typography-muted">© 2025 Syncora. Built by AFM.</p>
        </div>
      </footer>
    </>
  );
}
