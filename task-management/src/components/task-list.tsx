"use client";

import { format, isSameDay } from "date-fns";
import { Building, Clock } from "lucide-react";

import { Task, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface TaskListProps {
  selectedDate: Date | null;
  tasks?: Task[];
}

export function TaskList({ selectedDate, tasks }: TaskListProps) {
  if (!selectedDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a date to view tasks
          </p>
        </CardContent>
      </Card>
    );
  }

  const dayTasks = tasks
    ? tasks
        .filter((task) => isSameDay(new Date(task.dueDate), selectedDate))
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
      </CardHeader>
      <CardContent>
        {dayTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tasks scheduled for this day
          </p>
        ) : (
          <div className="space-y-4">
            {dayTasks.map((task, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg border p-3",
                  task.status === TaskStatus.pending &&
                    "bg-tag-neutral text-tag-neutral-foreground",
                  task.status === TaskStatus.in_progress &&
                    "bg-tag-blue text-tag-blue-foreground",
                  task.status === TaskStatus.completed &&
                    "bg-teg-green text-tag-green-foreground"
                )}
              >
                <h3 className="font-medium mt-0">{task.title}</h3>
                <p className="mt-0">{task.status}</p>
                <div className="mt-2 flex flex-col space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    <span>
                      {format(new Date(task.dueDate), "yy/MM/dd - h:mm a")}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/workspace/${task.workspaceId}`}
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                      {(task.workspace?.icon !=null && task.workspace?.icon != "" ) ?(
                          <span className="mr-1">{task.workspace?.icon}</span>
                      ):(
                          <Building className="mr-1 h-3.5 w-3.5" />
                      )}
                    <span>{task.workspace?.name}</span>
                  </Link>
                </div>
                {task.description && (
                  <p className="mt-2 text-sm">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
