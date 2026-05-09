"use client";

import { useState, useEffect } from "react";
import { UserSession } from "@/lib/session";
import { Navbar } from "@/components/layout/Navbar";
import LoginModal from "@/components/auth/LoginForm";
import { AddTaskModal } from "@/components/task/AddTaskModal";
import { EditTaskModal } from "@/components/task/EditTaskModal";
import { TaskFormData, TaskStatus } from "@/components/task/TaskForm";
import { createTaskAction, updateTaskAction, deleteTaskAction } from "@/actions/task.actions";
import { logoutAction } from "@/actions/auth.actions";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: number;
  userId?: number;
  judul: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
}

interface TaskBoardProps {
  user: UserSession | null;
  initialTasks: any[]; // The raw DB tasks
}

export function TaskBoard({ user, initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      // If user is logged in, use tasks from DB
      setTasks(initialTasks.map(t => ({
        ...t,
        status: t.status as TaskStatus,
        createdAt: new Date(t.createdAt)
      })));
    } else {
      // If guest, load from localStorage
      const storedTasks = localStorage.getItem("tasktracker_guest_tasks");
      if (storedTasks) {
        try {
          const parsed = JSON.parse(storedTasks);
          setTasks(parsed);
        } catch (e) {
          console.error("Failed to parse guest tasks");
        }
      }
    }
  }, [user, initialTasks]);

  const saveGuestTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("tasktracker_guest_tasks", JSON.stringify(newTasks));
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.reload();
  };

  const handleAddTask = async (data: TaskFormData) => {
    if (user) {
      const res = await createTaskAction(data);
      if (res.success) {
        window.location.reload();
      } else {
        alert("Failed to add task: " + res.message);
      }
    } else {
      const newTask: Task = {
        id: Date.now(),
        judul: data.judul,
        description: data.description,
        status: data.status,
        createdAt: new Date(),
      };
      saveGuestTasks([...tasks, newTask]);
      setIsAddModalOpen(false);
    }
  };

  const handleEditTask = async (data: TaskFormData) => {
    if (!taskToEdit) return;

    if (user) {
      const res = await updateTaskAction(taskToEdit.id, data);
      if (res.success) {
        window.location.reload();
      } else {
        alert("Failed to update task: " + res.message);
      }
    } else {
      const newTasks = tasks.map(t => 
        t.id === taskToEdit.id ? { ...t, ...data } : t
      );
      saveGuestTasks(newTasks);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    if (user) {
      const res = await deleteTaskAction(id);
      if (res.success) {
        window.location.reload();
      } else {
        alert("Failed to delete task: " + res.message);
      }
    } else {
      const newTasks = tasks.filter(t => t.id !== id);
      saveGuestTasks(newTasks);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Belum":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20";
      case "Proses":
        return "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "Selesai":
        return "border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20";
      default:
        return "border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900";
    }
  };

  const getBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case "Belum":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "Proses":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Selesai":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Navbar 
        user={user} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogoutClick={handleLogout} 
        onAddTaskClick={() => setIsAddModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-300">
            <p className="flex items-center gap-2">
              <strong>Guest Mode:</strong> Your tasks are saved locally in this browser. Please login to sync tasks to the database.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-xl font-medium mb-4">No tasks found</p>
              <Button onClick={() => setIsAddModalOpen(true)}>Create your first task</Button>
            </div>
          )}
          
          {tasks.map(task => (
            <div key={task.id} className={`rounded-lg shadow-sm border p-5 flex flex-col transition-all hover:shadow-md ${getStatusColor(task.status)}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg line-clamp-1">{task.judul}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap ml-3 ${getBadgeColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow line-clamp-3 mb-4 whitespace-pre-wrap">
                {task.description || "No description"}
              </p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                <span className="text-xs text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => {
                      setTaskToEdit(task);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddTask} 
      />

      <EditTaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setTaskToEdit(null);
        }} 
        onEdit={handleEditTask}
        taskId={taskToEdit ? taskToEdit.id : null}
        initialData={taskToEdit ? {
          judul: taskToEdit.judul,
          description: taskToEdit.description || "",
          status: taskToEdit.status
        } : null}
      />
    </div>
  );
}
