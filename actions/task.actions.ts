"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_negara_123";

async function getUserIdFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch (error) {
    return null;
  }
}

export async function getTasksAction() {
  const userId = await getUserIdFromSession();
  if (!userId) return { success: false, message: "Unauthorized", data: [] };

  try {
    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
    return { success: true, data: userTasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, message: "Server error", data: [] };
  }
}

export async function createTaskAction(data: { judul: string; description: string; status: "Belum" | "Proses" | "Selesai" }) {
  const userId = await getUserIdFromSession();
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    await db.insert(tasks).values({
      userId,
      judul: data.judul,
      description: data.description,
      status: data.status,
    });
    return { success: true, message: "Task created successfully" };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, message: "Server error" };
  }
}

export async function updateTaskAction(id: number, data: { judul: string; description: string; status: "Belum" | "Proses" | "Selesai" }) {
  const userId = await getUserIdFromSession();
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    await db.update(tasks)
      .set(data)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return { success: true, message: "Task updated successfully" };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, message: "Server error" };
  }
}

export async function deleteTaskAction(id: number) {
  const userId = await getUserIdFromSession();
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return { success: true, message: "Task deleted successfully" };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, message: "Server error" };
  }
}
