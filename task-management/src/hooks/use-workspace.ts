"use client";

import { useQuery } from "@tanstack/react-query";
import { WorkspaceMember } from "@/lib/types";
import { fetchMembersFromWorkspace } from "@/app/_api/activeWorkspaces"; // Consider centralizing API calls

export function useMembersByWorkspace(workspaceId: string) {
  return useQuery<WorkspaceMember[], Error>({
    queryKey: ["tasks", { workspaceId }], // More specific query key
    queryFn: () => fetchMembersFromWorkspace(workspaceId),
    enabled: !!workspaceId, // Only fetch when workspaceId exists
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    // onError: (error) => {
    //   console.error("Error fetching tasks:", error);
    //   // Consider adding error notification here
    // },
  });
}
