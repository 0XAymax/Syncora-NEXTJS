"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import KanbanBoard from "./KanbanBoard";
import TaskTab from "./TaskTab";
import CalendarTab from "./CalendarTab";
import MembersTab from "./MembersTab";
import { getTasksByWorkspaceId } from "@/app/_api/TasksAPI";
import { Task, WorkspaceMember } from "@/lib/types";
import { useRecentWorkspacesContext } from "@/context/RecentWorkspacesContext";
import { toast } from "sonner";
import { useWorkspaces } from "@/context/WorkspaceContext";
import { fetchMembersFromWorkspace } from "@/app/_api/WorkspacesAPIs";

function Page() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [todos, setTodos] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const { addRecentWorkspace } = useRecentWorkspacesContext();
  const { workspaces, loading } = useWorkspaces();
  const [workspace, setWorkspace] = useState(
    workspaces.find((w) => w.id === workspaceId)
  );
  const isPersonal = workspace?.isPersonal ?? false;

  useEffect(() => {
    if (!loading) {
      const workspaceExists = workspaces.some((w) => w.id === workspaceId);
      if (workspaceExists) {
        // Only add to recent if it exists
        addRecentWorkspace(workspaceId);
      }
    }
  }, [workspaceId, workspaces, loading, addRecentWorkspace]);

  useEffect(() => {
    // Only fetch if workspace exists
    if (!loading && workspace) {
      const getTasks = async () => {
        try {
          const data = await getTasksByWorkspaceId(workspaceId);
          setTodos(data);
        } catch (error) {
          console.error(`Error fetching tasks:`, error);
          toast.error("Error fetching tasks for workspace");
        }
      };
      getTasks();
    }
  }, [workspaceId, workspace, loading]);
  useEffect(() => {
    const getWorkspaceMembers = async () => {
      const response = await fetchMembersFromWorkspace(workspaceId);
      setMembers(response);
    };
    getWorkspaceMembers();
  }, [workspaceId]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Tabs defaultValue="kanban">
        <TabsList className="mb-4">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          {!isPersonal && <TabsTrigger value="members">Members</TabsTrigger>}
        </TabsList>
        <KanbanBoard
          workspaceId={workspaceId}
          todos={todos}
          setTodos={setTodos}
          isPersonal={isPersonal}
        />
        <TaskTab
          workspaceId={workspaceId}
          members={members}
          todos={todos}
          setTodos={setTodos}
          isPersonal={isPersonal}
        />
        <CalendarTab todos={todos} />
        {!isPersonal && workspace && (
          <MembersTab
            workspace={workspace}
            setWorkspace={setWorkspace}
            members={members}
            setMembers={setMembers}
          />
        )}
      </Tabs>
    </div>
  );
}
export default Page;
