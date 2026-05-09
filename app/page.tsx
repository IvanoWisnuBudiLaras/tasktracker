import { TaskBoard } from "@/components/task/TaskBoard";
import { getUserSession } from "@/lib/session";
import { getTasksAction } from "@/actions/task.actions";

export default async function MainMenu() {
  const user = await getUserSession();
  
  let initialTasks: any[] = [];
  if (user) {
    const res = await getTasksAction();
    if (res.success) {
      initialTasks = res.data;
    }
  }

  return <TaskBoard user={user} initialTasks={initialTasks} />;
}
