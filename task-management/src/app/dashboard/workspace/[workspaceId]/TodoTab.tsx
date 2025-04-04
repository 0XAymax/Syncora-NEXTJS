import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { MoreVertical } from 'lucide-react';
import React from 'react'

function TodoTab() {
  const todos = [
    {
      id: "1",
      title: "Finish project documentation",
      due: "Today",
      assigne: "Person X",
      status: "Done",
    },
    {
      id: "2",
      title: "Review pull requests",
      due: "Tomorrow",
      assigne: "Person X",
      status: "On going",
    },
    {
      id: "3",
      title: "Fix UI bugs in dashboard",
      due: "Friday",
      assigne: "Person X",
      status : "On going",
    },
    {
      id: "4",
      title: "Optimize database queries",
      due: "Friday",
      assigne: "Person X",
      status :"Done",
    },
    {
      id: "5",
      title: "Plan next sprint tasks",
      due: "Sunday",
      assigne: "Person X",
      status:"Done",
    },
  ];
  const OngoingTasks=todos.filter((todo) => todo.status == "On going")
  const doneTasks=todos.filter((todo) => todo.status == "Done")
  return (
    <TabsContent value="kanban" className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* To Do Column */}
        <Card className="border-t-4 border-t-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="font-semibold">To Do</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {todos.length} Tasks
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {todos.map((todo) => (
              <Card key={todo.id} className="p-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{todo.title}</h4>
                    <div className="text-xs text-muted-foreground">
                      Due: {todo.due}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assignee: {todo.assigne}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Ongoing Column */}
        <Card className="border-t-4 border-t-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="font-semibold">Ongoing</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {OngoingTasks.length} Tasks
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {OngoingTasks.map((todo) => (
              <Card key={todo.id} className="p-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{todo.title}</h4>
                    <div className="text-xs text-muted-foreground">
                      Due: {todo.due}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assignee: {todo.assigne}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Done Column */}
        <Card className="border-t-4 border-t-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="font-semibold">Done</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {doneTasks.length} Tasks
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {doneTasks.map((todo) => (
              <Card key={todo.id} className="p-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{todo.title}</h4>
                    <div className="text-xs text-muted-foreground">
                      Due: {todo.due}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Assignee: {todo.assigne}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}

export default TodoTab