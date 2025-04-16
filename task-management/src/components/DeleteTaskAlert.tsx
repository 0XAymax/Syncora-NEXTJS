"use client"
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
import { Button } from "./ui/button";
import { deleteTaskAPI } from "@/app/_api/TasksAPI";
import { Task } from "@/lib/types";
export default function DeleteTaskAlert({
  workspaceId,
  taskId,
  setTodos,
}: {
  workspaceId: string;
  taskId: string;
  setTodos: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const handleDeleteClick = async () => {
    try {
      const res = await deleteTaskAPI(workspaceId, taskId);
      setTodos(prev => prev.filter((todo) => todo.id != res.deletedTask.id))
    } catch (error) {
        console.error(
          `Error Deleting task ${taskId}:`,
          error
        );
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-[#ef4444] focus:text-[#ef4444] cursor-pointer"
          >
            <Delete className="mr-2 h-2 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete this task ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClick}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}