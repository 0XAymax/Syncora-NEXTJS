"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceMember } from "@/lib/types";
import { kickMemberAPI } from "@/app/_api/WorkspacesAPIs";
import { toast } from "sonner";
export default function DeleteTaskAlert({
  workspaceId,
  member,
  setMembers,
}: {
  workspaceId: string;
  member: WorkspaceMember;
  setMembers: React.Dispatch<React.SetStateAction<WorkspaceMember[]>>;
}) {
  const handleClick = async () => {
    try {
      const data = await kickMemberAPI(workspaceId, member.id);
      setMembers((prev) => {
        console.log(prev);
        console.log(data.deletedMember);
        return prev.filter((member) => member.id != data.deletedMember.id);
      });
      toast.success("Kicked member successfully.");
    } catch (error) {
      console.error(`Error kicking member:`, error);
      toast.error("Error deleting task");
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="h-7 text-xs hover:bg-destructive/90"
          >
            <Delete className="mr-2 h-2 w-4" />
            Kick
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to kick{" "}
              {member.user.name + " " + member.user.lastName} (
              {member.user.email}) from the workspace? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClick}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Kick {member.user.name + " " + member.user.lastName}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
