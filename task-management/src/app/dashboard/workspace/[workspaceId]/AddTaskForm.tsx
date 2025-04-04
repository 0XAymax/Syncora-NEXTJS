"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { WorkspaceMember } from "@/lib/types";
import { fetchMembersByWorkspaceId } from "@/app/_api/activeWorkspaces";
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
import {
  Plus,
  ChevronDown,
  Check,
  User,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addTaskAPI } from "@/app/_api/addTaskAPI";
import CustomDatePicker from "@/components/datePicker";
import {ClipLoader} from "react-spinners"

export function NewTaskDialog({ workspaceId }: { workspaceId: string }) {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string>("");
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); 
  const [loading, setLoading] = useState(false);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const title = titleRef.current?.value.trim();
    const description = descriptionRef.current?.value.trim();
    setLoading(true);
    if (!title) {
      setError("Title is required");
      setLoading(false);
      return;
    }
    if (!priority) {
      setError("Priority is required");
      setLoading(false);
      return;
    }
    if (!dueDate) {
      setError("Due date is required");
      setLoading(false);
      return;
    }
    if (selectedAssignees.length === 0) {
      setError("At least one assignee is required");
      setLoading(false);
      return;
    }
    console.log("dueDate before API call: ", dueDate);
    const task = {
      title,
      description,
      priority,
      workspaceId: workspaceId,
      dueDate: dueDate,
      assigneesIds: selectedAssignees,
    };
    console.log("Task object to send:", task); 

    try {
      const res = await addTaskAPI(task);
      if (res && res.message === "Task created successfully") {
        console.log("✅ Task added successfully!");
        setLoading(false);
        setOpen(false); 
        window.location.reload(); 
      } else {
        throw new Error("Task creation failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
      setLoading(false);
    }
  }; 
  useEffect(() => {
    const getWorkspaceMembers = async () => {
      const response = await fetchMembersByWorkspaceId(workspaceId);
      setMembers(response);
    };
    getWorkspaceMembers();
  }, [workspaceId]);
  const toggleAssignee = (id: string) => {
    setSelectedAssignees((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const getSelectedNames = () => {
    return members
      .filter((member) => selectedAssignees.includes(member.user.id))
      .map((member) => member.user.name);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>
              Create a new task by filling out the form below.
            </DialogDescription>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter task title" ref={titleRef} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                ref={descriptionRef}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 ">
                <Label htmlFor="status">Due Date</Label>
                <CustomDatePicker
                  onChange={(timestamp) => setDueDate(timestamp)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignees</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !selectedAssignees.length && "text-muted-foreground"
                    )}
                  >
                    {selectedAssignees.length > 0 ? (
                      <div className="flex items-center gap-1 truncate">
                        <span className="truncate">
                          {selectedAssignees.length === 1
                            ? getSelectedNames()[0]
                            : `${getSelectedNames()[0]} +${selectedAssignees.length - 1}`}
                        </span>
                      </div>
                    ) : (
                      "Select assignees"
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="max-h-[200px] overflow-auto p-1">
                    {members.map((member) => (
                      <div
                        key={member.user.id}
                        className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-muted cursor-pointer"
                        onClick={() => toggleAssignee(member.user.id)}
                      >
                        <Checkbox
                          id={`assignee-${member.user.id}`}
                          checked={selectedAssignees.includes(member.user.id)}
                          onCheckedChange={() => toggleAssignee(member.user.id)}
                        />
                        <label
                          htmlFor={`assignee-${member.user.id}`}
                          className="flex-grow cursor-pointer text-sm"
                        >
                          {member.user.name}
                        </label>
                        {selectedAssignees.includes(member.user.id) && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Display selected assignees */}
              {selectedAssignees.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {getSelectedNames().map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
                    >
                      <User className="h-3 w-3" />
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit}>
              Create
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
