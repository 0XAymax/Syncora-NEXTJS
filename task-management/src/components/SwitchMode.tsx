"use client";
import { ModeToggle } from "@/components/ui/modeToggle";

export default function SwitchMode() {
  return (
    <>
      <div className="fixed mt-5 ml-340 flex items-center gap-2">
        <span>Switch Mode</span>
        <ModeToggle />
      </div>
    </>
  );
}
