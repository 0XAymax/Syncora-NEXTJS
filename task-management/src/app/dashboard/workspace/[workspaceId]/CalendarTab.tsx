import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/calendar";

function CalendarTab() {
  return (
    <TabsContent value="calendar" className="space-y-6">
      <h2 className="mb-4 text-xl font-bold">Calendar</h2>
      <Calendar />
    </TabsContent>
  );
}

export default CalendarTab;
