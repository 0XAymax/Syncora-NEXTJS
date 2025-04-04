"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Delete, MoreHorizontal, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NewTaskDialog } from "./AddTaskForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTaskDialog } from "./EditTaskForm";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Assignee } from "@/types";
interface Task {
  id: string;
  title: string;
  dueDate?: string;
  assignees: Assignee[];
  status: string;
  priority: string;
}
function TaskTab() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("id");
  const [todos, setTodos] = useState<Task[]>([]);
  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.post("http://localhost:3001/api/tasks", {
          workspaceId,
        });
        setTodos(response.data);
      } catch (error) {
        console.error(
          `Error fetching tasks for workspace ${workspaceId}:`,
          error
        );
      }
    };
    getTasks();
  }, [workspaceId]);

  const status = [
    { title: "pending", style: "bg-gray-100" },
    { title: "in_progress", style: "bg-green-100 text-green-800" },
    { title: "completed", style: "bg-blue-100 text-blue-800" },
  ];
  const priorities = [
    { title: "high", style: "bg-red-500 hover:bg-red-600" },
    { title: "medium", style: "bg-yellow-500 hover:bg-yellow-600" },
    { title: "low", style: "bg-blue-500 hover:bg-blue-600" },
  ];

  const getStatusStyle = (taskStatus: string) => {
    const foundStatus = status.find((s) => s.title === taskStatus);
    return foundStatus ? foundStatus.style : "bg-gray-100"; // Default style if not found
  };
  const getPriorityStyle = (taskPriority: string) => {
    const foundPriority = priorities.find((p) => p.title === taskPriority);
    return foundPriority ? foundPriority.style : "bg-gray-100"; // Default style if not found
  };
  return (
    <TabsContent
      value="tasks"
      className="space-y-6 [&_td]:border-0 [&_th]:border-0"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Tasks</h2>
          <div className="rounded-md border">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todos.map((todo) => (
                  <TableRow key={todo.id}>
                    <TableCell className="font-medium">{todo.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusStyle(todo.status)}
                      >
                        {todo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityStyle(todo.priority)}>
                        {todo.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{todo.dueDate}</TableCell>
                    <TableCell className="flex items-center pt-3">
                      <User className="h-4 w-4" />{" "}
                      {todo.assignees[0]?.user?.name}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <EditTaskDialog />
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#ef4444] focus:text-[#ef4444] cursor-pointer">
                            <Delete className="mr-2 h-2 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={6}>
                    <NewTaskDialog />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}

export default TaskTab;
