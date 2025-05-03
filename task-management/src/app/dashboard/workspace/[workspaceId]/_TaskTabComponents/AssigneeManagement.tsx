"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus,X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Task, WorkspaceMember } from "@/lib/types";
import MemberProfileSheet from "@/app/dashboard/workspace/[workspaceId]/_TaskTabComponents/memberProfile";
import AvatarUser from "@/components/Avatar-User";

const AssigneeManagement = ({
                                todo,
                                members,
                                isUserSelected,
                                handleAssigneeSelection,
                                saveAssignees,
                                unassignUser
                            }: {
    todo: Task,
    members: WorkspaceMember[],
    isUserSelected: (taskId: string, memberId: string) => boolean,
    handleAssigneeSelection: (taskId: string, memberId: string) => void,
    saveAssignees: (taskId: string) => Promise<void>,
    unassignUser: (taskId: string, memberId: string) => Promise<void>
}) => {
    return (
        <div className="pl-8">
            <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm">Assignees:</p>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add assignees</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm">Add Assignees</h4>
                            <div className="space-y-2">
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`user-${todo.id}-${member.id}`}
                                            checked={isUserSelected(todo.id, member.id)}
                                            onCheckedChange={() => handleAssigneeSelection(todo.id, member.id)}
                                        />
                                        <label
                                            htmlFor={`user-${todo.id}-${member.id}`}
                                            className="text-sm flex flex-col cursor-pointer"
                                        >
                                            <span>{member.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{member.user.email}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => saveAssignees(todo.id)}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {todo.assignees?.length ? (
                    todo.assignees.map((assignee, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-sm bg-muted/40 rounded-md px-3 py-2"
                        >
                            <AvatarUser
                                name={assignee.user.name}
                                lastName={assignee.user.lastName}
                                avatarUrl={assignee.user.avatarUrl}
                                height={10}
                                width={10}
                                borderSize={2}
                                hasBorder={true}
                            />
                            <div className="flex-1 min-w-0">
                                <MemberProfileSheet member={assignee.user} assignedBy={`${assignee.assignedBy?.name ?? ""} ${assignee.assignedBy?.lastName ?? ""}`}>
                                  <div className="font-medium truncate cursor-pointer">{assignee.user.name}</div>
                                </MemberProfileSheet >
                                <div className="text-xs text-muted-foreground truncate">
                                    {assignee.user.email}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => unassignUser(todo.id, assignee.user.id)}
                            >
                                <X className="h-3.5 w-3.5" />
                                <span className="sr-only">Remove {assignee.user.name}</span>
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-muted-foreground italic col-span-2">No assignees</div>
                )}
            </div>
        </div>
    );
};

export default AssigneeManagement;