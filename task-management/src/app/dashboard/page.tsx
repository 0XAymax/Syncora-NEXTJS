"use client";

import RecentWorkspaces from "./_dashbordComponents/RecentWorkspaces";
import TaskForToday from "./_dashbordComponents/TaskForToday";
import ActiveWorkspaces from "./_dashbordComponents/ActiveWorkspaces";
import CalendarSection from "./_dashbordComponents/CalendarSection";
import {useState, useEffect, useCallback} from "react";
import { Task } from "@/lib/types";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  isBefore,
  isAfter,
  isSameDay,
} from "date-fns";
import { getTasksByUserId } from "../_api/TasksAPI";
import { useAuth } from "@/hooks/use-auth";
import SkeletonDashboard from "@/app/dashboard/_dashbordComponents/Skeleton";

export default function Page() {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedMonths, setFetchedMonths] = useState<string[]>([]);

  // Set lowerDate to the beginning of the previous month
  const [lowerDate, setLowerDate] = useState(() =>
    startOfMonth(subMonths(new Date(), 1))
  );

  // Set higherDate to the end of the next month
  const [higherDate, setHigherDate] = useState(() =>
    endOfMonth(addMonths(new Date(), 1))
  );

  const fetchTasksForRange = useCallback(
    async (start: Date, end: Date) => {
      if (!currentUser) return [];

      const startISO = start.toISOString();
      const endISO = end.toISOString();

      console.log(`Fetching tasks from ${startISO} to ${endISO}`);
      return await getTasksByUserId(currentUser.id, startISO, endISO);
    },
    [currentUser]
  );

  const handleMonthChange = useCallback(
    async (newMonth: Date) => {
      const monthKey = `${newMonth.getFullYear()}-${newMonth.getMonth()}`;

      // If we've already fetched this month, no need to fetch again
      if (fetchedMonths.includes(monthKey)) {
        return;
      }

      // Check if the new month is outside our current range
      const newMonthStart = startOfMonth(newMonth);
      const newMonthEnd = endOfMonth(newMonth);

      // Determine if we need to expand our range and in which direction
      const needToFetchPrevious = isBefore(newMonthStart, lowerDate);
      const needToFetchNext = isAfter(newMonthEnd, higherDate);

      if (needToFetchPrevious || needToFetchNext) {
        setLoading(true);

        // Determine the new boundaries
        const newLowerDate = needToFetchPrevious
          ? startOfMonth(subMonths(newMonthStart, 1))
          : lowerDate;

        const newHigherDate = needToFetchNext
          ? endOfMonth(addMonths(newMonthEnd, 1))
          : higherDate;

        // Fetch tasks for the newly added range
        let startFetch, endFetch;

        if (needToFetchPrevious) {
          startFetch = newLowerDate;
          endFetch = lowerDate;
        } else {
          startFetch = higherDate;
          endFetch = newHigherDate;
        }

        const newTasks = await fetchTasksForRange(startFetch, endFetch);

        // Update state
        setTodos((prevTodos) => {
          // Merge new tasks with existing tasks, avoiding duplicates
          const taskIds = new Set(prevTodos.map((task) => task.id));
          const uniqueNewTasks = newTasks.filter(
            (task:Task) => !taskIds.has(task.id)
          );

          return [...prevTodos, ...uniqueNewTasks];
        });

        // Update our date boundaries
        if (needToFetchPrevious) setLowerDate(newLowerDate);
        if (needToFetchNext) setHigherDate(newHigherDate);

        // Mark this month as fetched
        setFetchedMonths((prev) => [...prev, monthKey]);

        setLoading(false);
      }
    },
    [fetchedMonths, lowerDate, higherDate, fetchTasksForRange]
  );

  useEffect(() => {
    if (!currentUser) return;

    const initFetch = async () => {
      setLoading(true);
      const initialTasks = await fetchTasksForRange(lowerDate, higherDate);

      const monthsInRange = [];
      let currentMonth = new Date(lowerDate);

      while (isBefore(currentMonth, higherDate)) {
        monthsInRange.push(
          `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`
        );
        currentMonth = addMonths(currentMonth, 1);
      }

      setFetchedMonths(monthsInRange);
      setTodos(initialTasks);
      setLoading(false);
    };

    initFetch();
  }, [currentUser, fetchTasksForRange, lowerDate, higherDate]);

  if (!currentUser || loading) {
    return <SkeletonDashboard />;
  }


  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      {/* Recent Workspaces */}
      <RecentWorkspaces />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Your tasks for today */}
        <TaskForToday
          todos={todos.filter((t) => isSameDay(t.dueDate, new Date()))}
        />

        {/* Active Workspaces */}
        <ActiveWorkspaces />
      </div>

      {/* Calendar */}
      <CalendarSection todos={todos} onMonthChange={handleMonthChange} />
    </div>
  );
}
