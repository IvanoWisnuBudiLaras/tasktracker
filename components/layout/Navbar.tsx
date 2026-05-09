"use client";

import { Button } from "@/components/ui/button";
import { UserSession } from "@/lib/session";
import { LogOut, User as UserIcon, Plus } from "lucide-react";

interface NavbarProps {
  user: UserSession | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onAddTaskClick: () => void;
}

export function Navbar({ user, onLoginClick, onLogoutClick, onAddTaskClick }: NavbarProps) {
  return (
    <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TaskTracker
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={onAddTaskClick} className="gap-2" variant="default">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-4 ml-4 border-l pl-4 dark:border-zinc-800">
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline font-medium">{user.nama}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onLogoutClick} title="Logout">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="ml-4 border-l pl-4 dark:border-zinc-800">
                <Button variant="outline" onClick={onLoginClick}>
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
