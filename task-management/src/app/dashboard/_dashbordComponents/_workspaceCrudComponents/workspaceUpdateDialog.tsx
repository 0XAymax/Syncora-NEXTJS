"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { ClipLoader } from "react-spinners";
import { updateWorkspaceAPI } from "@/app/_api/WorkspacesAPIs";
import { useWorkspaces } from "@/context/WorkspaceContext";
import { Workspace } from "@/types";
import EmojiSelector from "@/components/EmojiPicker";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface UpdateWorkspaceDialogProps {
    workspaceId: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
export default function UpdateWorkspaceDialog(
    {
        workspaceId,
        open = false,
        onOpenChange
    }: UpdateWorkspaceDialogProps
) {
    const [loading, setLoading] = useState(false);
    const { workspaces, setWorkspaces } = useWorkspaces();
    const router = useRouter();
    const prevWorkspace = workspaces.find((w) => w.id === workspaceId);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [emoji, setEmoji] = useState("");

    useEffect(() => {
        if (prevWorkspace) {
            setName(prevWorkspace.name || "");
            setDescription(prevWorkspace.description || "");
            setEmoji(prevWorkspace.icon || "");
        }
    }, [prevWorkspace, open]);
    const closeModal = () => {
        onOpenChange?.(false);
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const workspace = {
            workspaceId,
            name: name.trim(),
            description: description.trim(),
            icon: emoji,
        };

        try {
            const res = await updateWorkspaceAPI(workspace);
            if (res && res.message === "Workspace updated successfully") {
                const newWorkspace = res.workspace as Workspace;
                setLoading(false);
                closeModal();
                setWorkspaces((prev) =>
                    prev.map((w) => (w.id === newWorkspace.id ? newWorkspace : w))
                );
                toast.success("Workspace updated successfully");
                router.push(`/dashboard/workspace/${newWorkspace.id}`);
            } else {
                throw new Error("Workspace update failed.");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Workspace</DialogTitle>
                        <DialogDescription>
                            Update the Workspace by filling out the form below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter workspace title"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter workspace description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <EmojiSelector onSelectAction={setEmoji} defaultValue={emoji} />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">
                            Update
                        </Button>
                    </DialogFooter>
                </form>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <ClipLoader color="#00BFFF" size={50} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}