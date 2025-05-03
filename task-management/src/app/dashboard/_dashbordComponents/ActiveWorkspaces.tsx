"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {ChevronRight, ImageIcon, MoreVertical, Pencil} from "lucide-react";
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
import {format} from "date-fns";
import UpdateWorkspaceDialog from "@/app/dashboard/_dashbordComponents/_workspaceCrudComponents/workspaceUpdateDialog";

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
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [workspaceToUpdate, setWorkspaceToUpdate] = useState<string | null>(null);
  console.log("WORKSPACE Description",workspaces);

  const toggleWorkspace = (id: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleOpenUpdateDialog = (workspaceId: string) => {
        setWorkspaceToUpdate(workspaceId);
        setTimeout(() => {
            setUpdateDialogOpen(true);
        }, 10);
  };

    return (
      <>
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
                    <div className="flex items-center justify-between rounded-md bg-input p-3">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2"  onClick={() => toggleWorkspace(workspace.id)}>
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
                                    <span className="text-xs font-medium  text-muted-foreground">
                                          Description
                                     </span>
                                        {workspace.description ? (
                                            <p className="text-sm text-primary mt-0.5">{workspace.description}</p>
                                        ) : (
                                            <p className="text-sm italic  text-muted-foreground mt-0.5">No description provided</p>
                                        )}
                                    </div>
                                    <div className="mt-1 pt-2 border-t border-gray-100">
                                     <span className="text-xs  text-muted-foreground">
                                            Last updated: {format(workspace.updatedAt.split("T")[0],"MMMM d, yyyy") || "Unknown"}
                                     </span>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                  </CollapsibleTrigger>
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
                                    onSelect={() => handleOpenUpdateDialog(workspace.id)}
                                    className="justify-start text-muted-foreground cursor-pointer w-full">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <div className="text-center">Edit</div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500"
                                    asChild
                                >
                                    <DeleteWorkspaceAlert workspaceId={workspace.id} />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    </div>
                  <CollapsibleContent>
                    {workspace.tasks?.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {workspace.tasks?.map((task, index) => (
                              <div
                                  key={index}
                                  className="flex items-center justify-between rounded-md border p-3"
                              >
                                <div>{task.title}</div>
                                <div className="text-sm text-gray-500">Due: {format(task.dueDate.split("T")[0],"MMMM d, yyyy")}</div>
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
    {workspaceToUpdate && (
        <UpdateWorkspaceDialog
            workspaceId={workspaceToUpdate}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
        />
    )}
    </>
  );
}

export default ActiveWorkspaces;
