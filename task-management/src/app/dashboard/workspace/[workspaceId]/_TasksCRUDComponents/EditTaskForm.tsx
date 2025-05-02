"use client";
import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { updateTaskAPI } from "@/app/_api/TasksAPI";
import CustomDatePicker from "@/components/datePicker";
import { ClipLoader } from "react-spinners";
import {toast} from "sonner";

export function EditTaskDialog({
  workspaceId,
  taskId,
  todos,
  setTodos,
  open,
  onOpenChange
}: {
  workspaceId: string;
  taskId :string;
  todos : Task[]
  setTodos: React.Dispatch<React.SetStateAction<Task[]>>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [dueDate, setDueDate] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const prevTodo=todos.find((todo) => todo.id == taskId);

  useEffect(() => {
    if (open && prevTodo) {
      setTitle(prevTodo.title || "");
      setDescription(prevTodo.description || "");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setDueDate(prevTodo.dueDate);
    }
  }, [open, prevTodo]);

  const closeModal = () => {
    onOpenChange?.(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
  const task = {
    title: title === "" ? undefined : title,
    description: description === "" ? undefined : description,
    workspaceId,
    dueDate:dueDate === "" ? undefined  :dueDate,
  };

    try {
      const res = await updateTaskAPI(workspaceId,taskId,task);
      if (res && res.message === "Task updated successfully.") {
        console.log("Updated Task",res.updatedTask);
        setTodos((prev) =>
            prev.map((t) => (t.id === res.updatedTask.id ? res.updatedTask : t))
          );
        console.log("TODOS after update",todos);
        setLoading(false);
        closeModal();
        toast.success("Task updated successfully.");
      } else {
        throw new Error("Task update failed.");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update a task by filling out the form below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                  id="title"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 ">
                <Label htmlFor="status">Due Date</Label>
                <CustomDatePicker
                  defaultValue={dueDate}
                  onChange={(timestamp) => setDueDate(timestamp)}
                />
              </div>
            </div>
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
