"use client"
import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {CalendarIcon, ChevronRight, Edit, MoreHorizontal, User} from 'lucide-react';
import { NewTaskDialog } from '../_TasksCRUDComponents/AddTaskForm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditTaskDialog } from '../_TasksCRUDComponents/EditTaskForm';
import { cn } from '@/lib/utils';
import {Task, TaskPriority, TaskStatus, WorkspaceMember} from "@/lib/types";
import DeleteTaskAlert from '../_TasksCRUDComponents/DeleteTaskAlert';
import AssigneeManagement from './AssigneeManagement';
import {updateStatusAPI, updateTaskPriorityAPI} from "@/app/_api/TasksAPI";
import {toast} from "sonner";
import {AxiosError} from "axios";
import PopoverComponent from './PopoverComponent';
import {format} from "date-fns";
import AvatarUser from "@/components/Avatar-User";

const TaskTable = ({
  workspaceId,
  todos,
  setTodos,
  isPersonal,
  expandedRows,
  toggleRowExpand,
  members,
  tempSelectedAssignees,
  handleAssigneeSelection,
  saveAssignees,
  unassignUser,
}: {
  workspaceId: string;
  todos: Task[];
  setTodos: React.Dispatch<React.SetStateAction<Task[]>>;
  isPersonal: boolean;
  expandedRows: Record<string, boolean>;
  toggleRowExpand: (id: string) => void;
  members: WorkspaceMember[];
  tempSelectedAssignees: Record<string, string[]>;
  handleAssigneeSelection: (taskId: string, memberId: string) => void;
  saveAssignees: (taskId: string) => Promise<void>;
  unassignUser: (taskId: string, memberId: string) => Promise<void>;
}) => {
    const [priorityPopoverTask, setPriorityPopoverTask] = useState<string | null>(null)
    const [statusPopoverTask, setStatusPopoverTask] = useState<string | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<string | null>(null);

    const handleOpenEditDialog = (taskId: string) => {
        setTaskToEdit(taskId);
        setTimeout(() => {
            setEditDialogOpen(true);
        }, 10);
    };

    const updatePriority = async(taskId: string, newPriority: string) => {
        try{
            const pastTodos = todos;
            setTodos((prev) => prev.map((todo) =>
                todo.id === taskId ? { ...todo, priority: newPriority as TaskPriority } : todo
            ));
            const res = await updateTaskPriorityAPI(workspaceId, taskId, newPriority);
            if(res){
                toast.success("Priority updated successfully.");
                setPriorityPopoverTask(null);
                return;
            } else {
                setTodos(pastTodos);
                toast.error('Failed to update priority');
                return;
            }
        } catch(error) {
            console.log("Failed to update Priority", error);
            toast.error('Failed to update priority');
        }
    };

    const updateStatus = async(taskId: string, newStatus: string) => {
        const pastTodos = todos;
        try {
            setTodos((prev) => prev.map((todo) =>
                todo.id === taskId ? { ...todo, status: newStatus as TaskStatus } : todo
            ));
            const response = await updateStatusAPI(workspaceId, taskId, newStatus);
            if (response && response.message == "Task status updated") {
                toast.success('Task status updated successfully.');
                setStatusPopoverTask(null);
                return;
            } else {
                setTodos(pastTodos);
                toast.error('Failed to update status');
                return;
            }
        } catch (e) {
            const error = e as AxiosError<{ message: string }>;
            if(error.response?.status === 403){
                setTodos(pastTodos);
                toast.error("Unauthorized: Not an assignee or workspace admin");
                return;
            } else {
                console.error("Error Updating Status", e);
                toast.error('Failed to update status');
            }
        }
    }

    const statusOptions = [
        { value: "pending", label: "Pending", style: "bg-gray-400" },
        { value: "in_progress", label: "In Progress", style: "bg-green-100 text-green-800" },
        { value: "completed", label: "Completed", style: "bg-blue-100 text-blue-800" },
    ];

    const priorityOptions = [
        { value: "high", label: "High", style: "bg-red-500 hover:bg-red-600" },
        { value: "medium", label: "Medium", style: "bg-yellow-500 hover:bg-yellow-600" },
        { value: "low", label: "Low", style: "bg-blue-500 hover:bg-blue-600" },
    ];

    const getStatusStyle = (taskStatus: string) => {
        const foundStatus = statusOptions.find((s) => s.value === taskStatus);
        return foundStatus ? foundStatus.style : "bg-gray-400";
    };

    const getPriorityStyle = (taskPriority: string) => {
        const foundPriority = priorityOptions.find((p) => p.value === taskPriority);
        return foundPriority ? foundPriority.style : "bg-gray-100";
    };

    const isUserSelected = (taskId: string, memberId: string) => {
        return (tempSelectedAssignees[taskId] || []).includes(memberId);
    };

    return (
        <>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Due Date</TableHead>
                        {!isPersonal && (<TableHead>Assignee</TableHead>)}
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {todos.map((todo) => (
                        <React.Fragment key={todo.id}>
                            <TableRow>
                                <TableCell className="font-medium">
                                    {todo.title}
                                </TableCell>
                                <TableCell>
                                    <PopoverComponent
                                        currentValue={todo.status}
                                        options={statusOptions}
                                        isOpen={statusPopoverTask === todo.id}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setStatusPopoverTask(todo.id);
                                            } else {
                                                setStatusPopoverTask(null);
                                            }
                                        }}
                                        onSelect={(value) => updateStatus(todo.id, value)}
                                        getStyle={getStatusStyle}
                                    />
                                </TableCell>
                                <TableCell>
                                    <PopoverComponent
                                        currentValue={todo.priority}
                                        options={priorityOptions}
                                        isOpen={priorityPopoverTask === todo.id}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setPriorityPopoverTask(todo.id);
                                            } else {
                                                setPriorityPopoverTask(null);
                                            }
                                        }}
                                        onSelect={(value) => updatePriority(todo.id, value)}
                                        getStyle={getPriorityStyle}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                        {format(new Date(todo.dueDate).toISOString().split("T")[0],"MMMM d, yyyy")}
                                    </div>
                                </TableCell>
                                {!isPersonal && (
                                    <TableCell className="flex items-center pt-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {todo.assignees?.[0] ? (
                                                    <AvatarUser
                                                        name={todo.assignees?.[0]?.user.name}
                                                        lastName={todo.assignees?.[0]?.user.lastName}
                                                        avatarUrl={todo.assignees?.[0]?.user.avatarUrl}
                                                        height={8}
                                                        width={8}
                                                        borderSize={2}
                                                        hasBorder={false}
                                                    />
                                                ):(
                                                    <User className="h-4 w-4 mr-1" />
                                                )}
                                                {todo.assignees?.[0]?.user?.name}
                                                {(todo.assignees?.length ?? 0) > 1 && (
                                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                     +{(todo.assignees?.length ?? 1) - 1}
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => toggleRowExpand(todo.id)}
                                            >
                                                <ChevronRight
                                                    className={cn(
                                                        "h-4 w-4 transition-transform",
                                                        expandedRows[todo.id]
                                                            ? "transform rotate-90"
                                                            : ""
                                                    )}
                                                />
                                            </Button>
                                        </div>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="w-full h-8 justify-start text-muted-foreground"
                                                onSelect={() => handleOpenEditDialog(todo.id)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <DeleteTaskAlert
                                                    workspaceId={workspaceId}
                                                    taskId={todo.id}
                                                    setTodos={setTodos}
                                                />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            {expandedRows[todo.id] && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-2 px-4 bg-muted/50"
                                    >
                                        <AssigneeManagement
                                            todo={todo}
                                            members={members}
                                            isUserSelected={isUserSelected}
                                            handleAssigneeSelection={handleAssigneeSelection}
                                            saveAssignees={saveAssignees}
                                            unassignUser={unassignUser}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                    <TableRow>
                        <TableCell colSpan={6}>
                            <NewTaskDialog
                                workspaceId={workspaceId}
                                setTodos={setTodos}
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
            {taskToEdit && (
                <EditTaskDialog
                    workspaceId={workspaceId}
                    taskId={taskToEdit}
                    todos={todos}
                    setTodos={setTodos}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                />
            )}
    </>
    );
};

export default TaskTable;
