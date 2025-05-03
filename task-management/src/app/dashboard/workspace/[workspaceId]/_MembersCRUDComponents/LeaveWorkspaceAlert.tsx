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
import { leaveWorkspaceAPI } from "@/app/_api/WorkspacesAPIs";
import { Workspace } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function LeaveWorkspaceAlert({
  workspace,
}: {
  workspace: Workspace;
}) {
  const workspaceName =
    (workspace.icon && workspace.icon + " ") + workspace.name;

  const router = useRouter();

  const handleDeleteClick = async () => {
    try {
      const data = await leaveWorkspaceAPI(workspace.id);
      console.log("Response from leaveWorkspaceAPI:", data);
      toast.success(`Left ${workspaceName} successfully.`);
      router.push("/dashboard");
    } catch (error) {
      console.error(`Error leaving workspace ${workspace.id}:`, error);
      toast.error(`Error leaving ${workspaceName}.`);
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
            Leave
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to leave {workspaceName} ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClick}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
