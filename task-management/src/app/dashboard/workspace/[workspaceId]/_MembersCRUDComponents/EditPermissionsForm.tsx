"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WorkspaceMember } from "@/lib/types";
import { changeRoleAPI } from "@/app/_api/WorkspacesAPIs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { Workspace } from "@/types";

export function EditPermissionsForm({
  workspace,
  member,
  members,
  setMembers,
}: {
  workspace: Workspace;
  member: WorkspaceMember;
  members: WorkspaceMember[] | undefined;
  setMembers: React.Dispatch<React.SetStateAction<WorkspaceMember[]>>;
}) {
  const [newRole, setNewRole] = useState(member.role.toString());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!newRole || newRole === member.role) {
      toast.error("Please select a new role.");
      setLoading(false);
      return;
    }

    try {
      const res = await changeRoleAPI(workspace.id, member.user.id, newRole);
      console.log(res);
      if (res && res.status < 300 && res.status >= 200) {
        const prevMembers = members;
        const updatedMembers = prevMembers?.map((m) => {
          if (m.user.id === member.user.id) {
            return { ...m, role: newRole } as WorkspaceMember;
          }
          return m;
        });
        setMembers(updatedMembers || []);
        toast.success("Role updated successfully.");
        setLoading(false);
        setOpen(false);
      } else {
        throw new Error("Role update failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Permissions...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form>
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
            <DialogDescription>
              {member.user.name} {member.user.lastName} is currently a{" "}
              {member.role}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Label htmlFor="role">Role: </Label>
            <Select onValueChange={setNewRole} defaultValue={member.role}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex justify-between sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit}>
              Update
            </Button>
          </DialogFooter>
        </form>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            {/* React spinner centered */}
            <ClipLoader color="#00BFFF" size={50} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
