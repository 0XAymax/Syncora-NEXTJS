"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { InviteDialog } from "./_MembersCRUDComponents/InviteMemberForm";
import { Workspace } from "@/types";
import { EditPermissionsForm } from "./_MembersCRUDComponents/EditPermissionsForm";
import { WorkspaceMember } from "@/lib/types";
import { User } from "@/hooks/use-auth";
import KickMemberAlert from "./_MembersCRUDComponents/KickMemberAlert";

export default function MembersTab({
  workspace,
  members,
  setMembers,
}: {
  workspace: Workspace;
  members: WorkspaceMember[];
  setMembers: React.Dispatch<React.SetStateAction<WorkspaceMember[]>>;
}) {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<string>("");

  const canChangePermission = (
    currentUser: User | null,
    member: WorkspaceMember
  ) => {
    if (!currentUser) return false;
    if (currentUser.id === workspace.ownerId) return true;
    if (currentUser.role === "admin" && member.id !== workspace.ownerId)
      return true;
    return false;
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredMembers =
    filter && members
      ? members.filter((m) => {
          const name = m.user.name.toLowerCase();
          const email = m.user.email.toLowerCase();
          const lastName = m.user.lastName.toLowerCase();
          const loFilter = filter.toLowerCase();
          return (
            name.includes(loFilter) ||
            email.includes(loFilter) ||
            lastName.includes(loFilter)
          );
        })
      : members;
  console.log("Members: ", members);
  console.log("filter: " + filter + "isFilter: " + !!filter);
  console.log("Filtered Members: ", filteredMembers);

  return (
    <TabsContent
      value="members"
      className="space-y-6 [&_td]:border-0 [&_th]:border-0"
    >
      <div>
        <h2 className="mb-4 text-xl font-bold">Members</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Name:</span>
              <div className="relative">
                <Input
                  className="h-8 w-24 pr-8"
                  placeholder="Text"
                  onChange={handleFilterChange}
                />
                {filter && (
                  <button
                    type="button"
                    onClick={() => setFilter("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Clear filter"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          <InviteDialog workspaceId={workspace.id} members={members} />

          <div className="space-y-2 pt-2">
            {filteredMembers &&
              filteredMembers.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32`}
                      />
                      <AvatarFallback>
                        {member.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {member.user.name}
                        {member.user.id === currentUser?.id && " (You)"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.id === workspace.ownerId
                          ? "Owner"
                          : member.role}
                      </div>
                    </div>
                  </div>
                  {canChangePermission(currentUser, member) &&
                    currentUser?.id !== member.user.id && (
                      <div className="flex gap-2">
                        <EditPermissionsForm
                          members={members}
                          member={member}
                          setMembers={setMembers}
                          workspace={workspace}
                        />
                        <KickMemberAlert
                          member={member}
                          setMembers={setMembers}
                          workspaceId={workspace.id}
                        />
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
