// context/WorkspacesContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Workspace } from "@/types";
import {fetchActiveWorkspacesAPI} from "@/app/_api/WorkspacesAPIs";

type WorkspacesContextType = {
  workspaces: Workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
  loading: boolean;
};

const WorkspacesContext = createContext<WorkspacesContextType | null>(null);

export const WorkspacesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        const data = await fetchActiveWorkspacesAPI();
        setWorkspaces(data);
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      }
    };
    getWorkspaces();
    setLoading(false);
  }, []);

  return (
    <WorkspacesContext.Provider value={{ workspaces, setWorkspaces, loading }}>
      {children}
    </WorkspacesContext.Provider>
  );
};

export const useWorkspaces = () => {
  const context = useContext(WorkspacesContext);
  if (!context)
    throw new Error("useWorkspaces must be used inside WorkspacesProvider");
  return context;
};
