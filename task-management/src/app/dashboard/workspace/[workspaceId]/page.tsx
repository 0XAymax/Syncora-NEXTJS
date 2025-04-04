import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodoTab from "./TodoTab";
import TaskTab from "./TaskTab";
import CalendarTab from "./CalendarTab";
import MembersTab from "./MembersTab";

async function page({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Tabs defaultValue="kanban">
        <TabsList className="mb-4">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TodoTab />
        <TaskTab />
        <CalendarTab />
        <MembersTab workspaceId={workspaceId} />
      </Tabs>
    </div>
  );
}

export default page;
