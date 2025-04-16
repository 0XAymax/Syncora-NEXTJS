"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Task } from "@/lib/types";
import axios from "axios";
import { MoreVertical } from "lucide-react";
import React from "react";

function TodoTab({ workspaceId }: { workspaceId: string }) {
  const [todos, setTodos] = React.useState<Task[]>();
  React.useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/task/tasks",
          { workspaceId }
        );
        console.log("Fetched tasks:", response.data);
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
  const todoTasks = todos?.filter((todo) => todo.status === "pending");
  const OngoingTasks = todos?.filter((todo) => todo.status == "in_progress");
  const doneTasks = todos?.filter((todo) => todo.status == "completed");
  return (
    <TabsContent value="kanban" className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* To Do Column */}
        <Card className="border-t-4 border-t-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="font-semibold">To Do</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {todoTasks?.length} Tasks
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {todoTasks?.map((todo) => (
              <Card key={todo.id} className="p-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{todo.title}</h4>
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(todo.dueDate).toISOString().split("T")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assignee:{" "}
                      <div className="flex space-x-2">
                        {todo.assignees?.map((assigne) => (
                          <div
                            key={assigne.id}
                            className="flex items-center space-x-1"
                          >
                            <span>{assigne.user.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Ongoing Column */}
        <Card className="border-t-4 border-t-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="font-semibold">Ongoing</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {OngoingTasks?.length} Tasks
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {OngoingTasks?.map((todo) => (
              <Card key={todo.id} className="p-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{todo.title}</h4>
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(todo.dueDate).toISOString().split("T")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assignee:{" "}
                      <div className="flex space-x-2">
                        {todo.assignees?.map((assigne) => (
                          <div
                            key={assigne.id}
                            className="flex items-center space-x-1"
                          >
                            <span>{assigne.user.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Done Column */}
        <Card className="border-t-4 border-t-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="font-semibold">Done</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {doneTasks?.length} Tasks
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {doneTasks?.map((todo) => (
              <Card key={todo.id} className="p-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{todo.title}</h4>
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(todo.dueDate).toISOString().split("T")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assignee:{" "}
                      <div className="flex space-x-2">
                        {todo.assignees?.map((assigne) => (
                          <div
                            key={assigne.id}
                            className="flex items-center space-x-1"
                          >
                            <span>{assigne.user.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}

export default TodoTab;
