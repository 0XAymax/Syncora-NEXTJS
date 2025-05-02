"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Task, TaskAssignee, TaskStatus } from '@/lib/types';
import { MoreVertical, GripVertical } from 'lucide-react';
import React, { useState } from 'react'
import {DragDropContext, Droppable, Draggable, DropResult, DragStart, DragUpdate} from "@hello-pangea/dnd"
import { updateStatusAPI } from "@/app/_api/TasksAPI";
import {toast} from "sonner";
import {AxiosError} from "axios";
import { format } from "date-fns"
function KanbanBoard({
  workspaceId,
  todos,
  setTodos,
  isPersonal,
}: {
  workspaceId: string;
  todos: Task[];
  setTodos: React.Dispatch<React.SetStateAction<Task[]>>;
  isPersonal: boolean;
}) {
  const todoTasks = todos?.filter((todo) => todo.status === "pending");
  const ongoingTasks = todos?.filter((todo) => todo.status === "in_progress");
  const doneTasks = todos?.filter((todo) => todo.status === "completed");

  // Track which column is currently being dragged over
  const [activeDroppableId, setActiveDroppableId] = useState<string | null>(
    null
  );

  const onDragEnd = async (result: DropResult) => {
    setActiveDroppableId(null);
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    let draggedTask;
    let newStatus;

    if (source.droppableId === 'todo') {
      draggedTask = todoTasks[source.index];
      newStatus = "pending";
    } else if (source.droppableId === "ongoing") {
      draggedTask = ongoingTasks[source.index];
      newStatus = "in_progress";
    } else {
      draggedTask = doneTasks[source.index];
      newStatus = "completed";
    }

    if (destination.droppableId === 'todo') {
      newStatus = 'pending';
    } else if (destination.droppableId === 'ongoing') {
      newStatus = 'in_progress';
    } else if (destination.droppableId === 'done') {
      newStatus = 'completed';
    }

    if (draggedTask.status !== newStatus) {
      const pastTodos = todos;
      try {
        setTodos((prev) => prev.map((todo) =>
            todo.id === draggedTask.id ? { ...todo, status: newStatus as TaskStatus } : todo
        ));
        const response = await updateStatusAPI(workspaceId, draggedTask.id, newStatus);

        if (response && response.message == "Task status updated") {
          toast.success('Task status updated successfully.');
          return;
        } else {
          setTodos(pastTodos);
          console.log("test")
          return ;
        }
      } catch (e) {
        const error = e as AxiosError<{ message: string }>;
        if(error.response?.status === 403){
          setTodos(pastTodos);
          toast.error("Unauthorized: Not an assignee or workspace admin");
          return ;
        }else{
          console.error("Error Updating Status", e);
        }
      }
    }
    console.log(`Task ${draggedTask.id} moved to ${newStatus}`);
  };

  const onDragStart = (result: DragStart) => {
    const { source } = result;
    setActiveDroppableId(source.droppableId);
  };

  const onDragUpdate = (result: DragUpdate) => {
    const { destination } = result;
    setActiveDroppableId(destination?.droppableId || null);
  };

  const TaskCard = ({ task, index }: { task: Task; index: number }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`p-3 mb-3 transition-all ${snapshot.isDragging ? "shadow-lg ring-2 ring-tag-blue z-10" : ""}`}
        >
          <div className="flex justify-between">
            <div className="flex-1 pr-2">
              <div className="flex items-center mb-2">
                <div
                  {...provided.dragHandleProps}
                  className="mr-2 p-1 rounded hover:bg-accent cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 text-accent-foreground" />
                </div>
                <h4 className="text-sm font-medium">{task.title}</h4>
              </div>
              <div className="text-xs text-muted-foreground ml-6">
                Due: {format(new Date(task.dueDate).toISOString().split("T")[0],"MMMM d, yyyy")}
              </div>
              {!isPersonal && (
                <div className="text-xs text-muted-foreground ml-6 mt-1">
                  Assignee:{" "}
                  <div className="flex space-x-2">
                    {task.assignees?.map((assignee: TaskAssignee) => (
                      <div
                        key={assignee.id}
                        className="flex items-center space-x-1"
                      >
                        <span>{assignee.user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 self-start">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </Draggable>
  );

  return (
      <TabsContent value="kanban" className="space-y-6">
        <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* To Do Column */}
            <Card className={`border-t-4 border-t-gray-200 transition-all ${activeDroppableId === 'todo' ? 'ring-2 ring-blue-400 bg-blue-50/20' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="font-semibold">Pending</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {todoTasks?.length} Tasks
                </Badge>
              </CardHeader>
              <Droppable droppableId="todo">
                {(provided, snapshot) => (
                    <CardContent className={`min-h-64 transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}>
                      <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 p-1"
                      >
                        {todoTasks.map((todo, index) => (
                            <TaskCard key={todo.id} task={todo} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    </CardContent>
                )}
              </Droppable>
            </Card>

            {/* Ongoing Column */}
            <Card className={`border-t-4 border-t-blue-200 transition-all ${activeDroppableId === 'ongoing' ? 'ring-2 ring-blue-400 bg-blue-50/30' : 'bg-blue-50/10'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="font-semibold">In Progress</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {ongoingTasks?.length} Tasks
                </Badge>
              </CardHeader>
              <Droppable droppableId="ongoing">
                {(provided, snapshot) => (
                    <CardContent className={`min-h-64 transition-colors ${snapshot.isDraggingOver ? 'bg-blue-100/50' : ''}`}>
                      <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 p-1"
                      >
                        {ongoingTasks.map((todo, index) => (
                            <TaskCard key={todo.id} task={todo} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    </CardContent>
                )}
              </Droppable>
            </Card>

            {/* Done Column */}
            <Card className={`border-t-4 border-t-green-200 transition-all ${activeDroppableId === 'done' ? 'ring-2 ring-green-400 bg-green-50/30' : 'bg-green-50/10'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="font-semibold">Completed</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {doneTasks?.length} Tasks
                </Badge>
              </CardHeader>
              <Droppable droppableId="done">
                {(provided, snapshot) => (
                    <CardContent className={`min-h-64 transition-colors ${snapshot.isDraggingOver ? 'bg-green-100/50' : ''}`}>
                      <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 p-1"
                      >
                        {doneTasks.map((todo, index) => (
                            <TaskCard key={todo.id} task={todo} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    </CardContent>
                )}
              </Droppable>
            </Card>
          </div>
        </DragDropContext>
      </TabsContent>
  );
}

export default KanbanBoard;
