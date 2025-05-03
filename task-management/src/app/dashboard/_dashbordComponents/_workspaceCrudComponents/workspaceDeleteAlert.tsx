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
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteWorkspaceAPI } from "@/app/_api/WorkspacesAPIs";
import { useWorkspaces } from "@/context/WorkspaceContext";
import React from "react";
import { useRecentWorkspacesContext } from "@/context/RecentWorkspacesContext";
import { toast } from "sonner";
export default function DeleteWorkspaceAlert({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const { setWorkspaces } = useWorkspaces();
  const { deleteRecentWorkspace } = useRecentWorkspacesContext();
  const handleDeleteClick = async () => {
    try {
      const res = await deleteWorkspaceAPI(workspaceId);
      if (res && res.message == "Workspace deleted successfully") {
        setWorkspaces((prev) =>
          prev.filter((workspace) => workspace.id != workspaceId)
        );
        deleteRecentWorkspace(workspaceId);
        toast.success("Workspace deleted successfully");
      } else {
        throw new Error("Workspace delete failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error(`Error Deleting Workspace ${workspaceId}:`, error);
        toast.error(`Error Deleting Workspace ${workspaceId}:`);
      }
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="justify-start text-destructive focus:text-destructive cursor-pointer w-full h-8"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete this Workspace ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClick}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
