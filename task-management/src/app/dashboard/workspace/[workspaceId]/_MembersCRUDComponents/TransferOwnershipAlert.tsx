"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkspaceMember } from "@/lib/types";
import { transferOwnershipAPI } from "@/app/_api/WorkspacesAPIs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Workspace } from "@/types";

export function TransferOwnershipAlert({
  workspace,
  setWorkspace,
  member,
}: {
  workspace: Workspace;
  setWorkspace: any;
  member: WorkspaceMember;
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await transferOwnershipAPI(workspace.id, member.user.id);

      if (res && res.status < 300 && res.status >= 200) {
        const newWorkspace = workspace;
        newWorkspace.ownerId = member.user.id;
        setWorkspace(newWorkspace);
        toast.success("Ownership transferred successfully.");
        setOpen(false);
      } else {
        throw new Error("Ownership transfer failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Make owner...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form>
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
            <DialogDescription>
              {member.user.name} {member.user.lastName} is currently a{" "}
              {member.role}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit}>
              Transfer Ownership
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
