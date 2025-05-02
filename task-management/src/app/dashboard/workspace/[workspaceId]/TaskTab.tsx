"use client";
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Task, TaskAssignee, WorkspaceMember } from "@/lib/types";
import TaskTable from "./_TaskTabComponents/TaskTable";
import { taskAssigneeAPI, taskUnassigneeAPI } from "@/app/_api/TasksAPI";
import { toast } from "sonner";
import { AxiosError } from "axios";

function TaskTab({
  workspaceId,
  todos,
  setTodos,
  members,
  isPersonal,
}: {
  workspaceId: string;
  todos: Task[];
  setTodos: React.Dispatch<React.SetStateAction<Task[]>>;
  members: WorkspaceMember[];
  isPersonal: boolean;
}) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [tempSelectedAssignees, setTempSelectedAssignees] = useState<
    Record<string, string[]>
  >({});

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAssigneeSelection = (taskId: string, memberId: string) => {
    setTempSelectedAssignees((prev) => {
      const currentSelected = prev[taskId] || [];
      if (currentSelected.includes(memberId)) {
        return {
          ...prev,
          [taskId]: currentSelected.filter((id) => id !== memberId),
        };
      } else {
        return {
          ...prev,
          [taskId]: [...currentSelected, memberId],
        };
      }
    });
  };

  const saveAssignees = async (taskId: string) => {
    const selectedIds = tempSelectedAssignees[taskId] || [];
    const assignees = {
      taskId,
      workspaceId,
      workspaceMemberIds: selectedIds,
    };
    const pastTodos = todos;
    try {
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === taskId) {
            const newAssignees = selectedIds
              .map((id) => {
                const member = members.find((m) => m.id === id);
                if (!member) return null;
                return {
                  id: crypto.randomUUID(),
                  taskId,
                  userId: member.user.id,
                  assignedAt: new Date(),
                  task: todo,
                  user: member.user,
                } as TaskAssignee;
              })
              .filter(Boolean) as TaskAssignee[];

            return {
              ...todo,
              assignees: newAssignees,
            };
          }
          return todo;
        });
      });
      const data = await taskAssigneeAPI(assignees);
      if (data.message === "Task assigned successfully") {
        toast.success("Task assigned successfully");
        return;
      } else {
        setTodos(pastTodos);
        toast.error("Task assign failed");
        return;
      }
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      if (error.response?.status === 400) {
        setTodos(pastTodos);
        toast.error("All users are already assigned to this task.");
        return;
      } else {
        console.error(error);
        toast.error("Something went wrong assigning users.");
      }
    }
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  };

  const unassignUser = async (taskId: string, memberId: string) => {
    const member = members.find((m) => m.user.id === memberId);
    if (!member) {
      toast.error("Cannot find the user, please try again.");
      return;
    }
    const unassign = {
      taskId,
      workspaceId,
      workspaceMemberIds: [member.id],
    };
    try {
      const pastTodos = todos;
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === taskId) {
            return {
              ...todo,
              assignees: (todo.assignees || []).filter(
                (assignee) => assignee.user.id !== memberId
              ),
            };
          }
          return todo;
        });
      });
      const res = await taskUnassigneeAPI(unassign);
      if (res && res.data.message === "Task unassigned successfully") {
        toast.success("Task unassigned successfully");
        return;
      } else {
        setTodos(pastTodos);
        toast.error("Unassign task failed.");
        return;
      }
    } catch (e) {
      console.error("Failed to unassign task", e);
    }
  };

  return (
    <TabsContent
      value="tasks"
      className="space-y-6 [&_td]:border-0 [&_th]:border-0"
    >
      <div className="w-full">
        <h2 className="mb-4 text-xl font-bold">Tasks</h2>
        <TaskTable
          workspaceId={workspaceId}
          todos={todos}
          setTodos={setTodos}
          isPersonal={isPersonal}
          expandedRows={expandedRows}
          toggleRowExpand={toggleRowExpand}
          members={members}
          tempSelectedAssignees={tempSelectedAssignees}
          handleAssigneeSelection={handleAssigneeSelection}
          saveAssignees={saveAssignees}
          unassignUser={unassignUser}
        />
      </div>
    </TabsContent>
  );
}

export default TaskTab;
