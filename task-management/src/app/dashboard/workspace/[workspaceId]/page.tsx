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
import {AxiosError} from "axios";


function Page() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [todos, setTodos] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const { addRecentWorkspace } = useRecentWorkspacesContext();
  const { workspaces, loading } = useWorkspaces();
  const [notFoundError, setNotFoundError] = useState(false);
  const [forbiddenError, setForbiddenError] = useState(false);
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

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await getTasksByWorkspaceId(workspaceId);
        setTodos(response);
        addRecentWorkspace(workspaceId);
      } catch (e) {
        const error = e as AxiosError<{ message: string }>;
        if(error.response?.status == 403){
          setForbiddenError(true);
          toast.error("You are not authorized to access this page.");
          return;
        }
        if(error.response?.status == 404) {
          setNotFoundError(true);
          return ;
        }
       else{
          console.error(`Error fetching tasks for workspace ${workspaceId}:`, e);
          toast.error("Error fetching tasks for workspace:");
        }
      }
    };
      getTasks();
  }, [workspaces, workspaceId, loading]);
      
  if (notFoundError || forbiddenError) {
    return (
        <div className="flex flex-1 items-center justify-center">
            {notFoundError &&(
                <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
              <p className="text-lg text-gray-600">Workspace not found</p>
              <p className="text-sm text-gray-500 mt-2">Please check the URL or go back to your dashboard.</p>
              </div>
            )}
          {forbiddenError && (
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                <p className="text-lg text-gray-600">You are not authorized to access this page.</p>
              </div>
          )}
        </div>
    );
  }

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
