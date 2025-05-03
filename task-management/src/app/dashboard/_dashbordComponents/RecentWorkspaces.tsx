"use client";
import { Card } from "@/components/ui/card";
import { ImageIcon, User } from "lucide-react";
import React from "react";
import AddWorkspaceDialog from "@/app/dashboard/_dashbordComponents/_workspaceCrudComponents/workspaceAddModalDialog";
import { useRecentWorkspacesContext } from "@/context/RecentWorkspacesContext";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
function RecentWorkspaces() {
    const { recent} = useRecentWorkspacesContext();
    const personalWorkspaces= recent.filter((item) => item.workspace.isPersonal == true)
    const publicWorkspaces = recent.filter((item) => item.workspace.isPersonal == false)
    return (
        <ScrollArea className="w-100% whitespace-nowrap rounded-md pb-3">
            <h2 className="mb-4 text-xl font-bold">Recent Workspaces</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 ">
                        <AddWorkspaceDialog/>
                {personalWorkspaces.map(item => (
                    <Link key={item.id} href={`/dashboard/workspace/${item.workspaceId}`} className="hover:no-underline">
                        <Card className="flex h-36 w-36 flex-col items-center justify-center">
                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-md cursor-pointer" >
                                {(item.workspace.icon == null || item.workspace.icon == '') ? (
                                    <User className="h-10 w-10 text-gray-500" />
                                ) : (
                                    <span className="h-10 w-10 flex items-center justify-center text-gray-500 text-3xl">
                                         {item.workspace.icon}
                                </span>
                                )}
                            </div>
                            <div className="mt-2 text-center text-gray-500 text-sm">{item.workspace.name}</div>
                        </Card>
                    </Link>

                ))}
                {publicWorkspaces.map((item) => (
                    <Link key={item.id} href={`/dashboard/workspace/${item.workspaceId}`} className="hover:no-underline">
                        <Card
                            className="flex h-36 w-36 flex-col items-center justify-center"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-md cursor-pointer">
                                {(item.workspace.icon == null || item.workspace.icon == '') ? (
                                    <ImageIcon className="h-10 w-10 text-gray-500" />
                                ) : (
                                    <span className="h-10 w-10 flex items-center justify-center text-gray-500 text-3xl">
                                        {item.workspace.icon}
                                 </span>
                                )}
                            </div>
                            <div className="mt-2 text-center text-gray-500 text-sm">{item.workspace.name}</div>
                        </Card>
                    </Link>

                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}

export default RecentWorkspaces;
