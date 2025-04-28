"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, ImageIcon, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { useWorkspaces } from "@/context/WorkspaceContext";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteWorkspaceAlert from "@/app/dashboard/_dashbordComponents/_workspaceCrudComponents/workspaceDeleteAlert";

import { useAuth } from "@/hooks/use-auth";
import {ScrollArea} from "@/components/ui/scroll-area";

interface OpenStates {
  [key: string]: boolean;
}
function ActiveWorkspaces() {
  const { workspaces } = useWorkspaces();
  const { currentUser: user } = useAuth();
  const [openStates, setOpenStates] = useState(
    workspaces.reduce((acc: OpenStates, workspace) => {
      acc[workspace.id] = workspace.defaultOpen;
      return acc;
    }, {})
  );
  console.log("WORKSPACE Description",workspaces);

  const toggleWorkspace = (id: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
      <section>
        <h2 className="mb-4 text-xl font-bold">Active Workspaces</h2>
        <ScrollArea className="h-41">
          <div className="space-y-2">
            {workspaces.map((workspace) => (
                <Collapsible
                    key={workspace.id}
                    defaultOpen={workspace.defaultOpen}
                    open={openStates[workspace.id]}
                    onOpenChange={(open) =>
                        setOpenStates((prev) => ({ ...prev, [workspace.id]: open }))
                    }
                >
                  <CollapsibleTrigger
                      className="flex w-full items-center justify-between rounded-md bg-gray-200 p-3"
                      onClick={() => toggleWorkspace(workspace.id)}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                          className={`h-4 w-4 transition-transform ${openStates[workspace.id] ? "rotate-90" : ""}`}
                      />
                        {(workspace.icon == null || workspace.icon == '') ? (
                            <ImageIcon className="h-5 w-5" />
                        ):(
                            <span className="h-5 w-5">{workspace.icon}</span>
                        )}
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                 <span className="font-medium cursor-pointer hover:underline text-primary">
                                    {workspace.name}
                                 </span>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 p-4 rounded-lg border border-gray-200 shadow-lg">
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-sm font-semibold text-gray-700">Workspace Details</h4>
                                    <div>
                                    <span className="text-xs font-medium  text-gray-500">
                                          Description
                                     </span>
                                        {workspace.description ? (
                                            <p className="text-sm text-gray-700 mt-0.5">{workspace.description}</p>
                                        ) : (
                                            <p className="text-sm italic text-gray-500 mt-0.5">No description provided</p>
                                        )}
                                    </div>
                                    <div className="mt-1 pt-2 border-t border-gray-100">
                                     <span className="text-xs text-gray-500">
                                            Last updated: {workspace.updatedAt?.split("T")[0] || "Unknown"}
                                     </span>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                    {workspace.ownerId === user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="focus:outline-none"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                asChild
                            >
                              <DeleteWorkspaceAlert workspaceId={workspace.id} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {workspace.tasks?.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {workspace.tasks?.map((task, index) => (
                              <div
                                  key={index}
                                  className="flex items-center justify-between rounded-md border p-3"
                              >
                                <div>{task.title}</div>
                                <div className="text-sm text-gray-500">Due: Soon</div>
                              </div>
                          ))}
                        </div>
                    ) : (
                        <p className="p-3 text-sm text-gray-500">No tasks available.</p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </section>
  );
}

export default ActiveWorkspaces;
