import { notFound } from "next/navigation";
import { fetchWorkspaceById } from "@/app/_api/WorkspacesAPIs"; // Server-side API

// This runs on server before page loads
export default async function WorkspaceLayout({ params, children }) {
  // Validate workspace exists server-side
  const { workspaceId } = await params;
  const workspace = await fetchWorkspaceById(workspaceId);

  if (!workspace) {
    notFound(); // This happens BEFORE any client rendering
  }

  return <>{children}</>;
}
