"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuillEditor } from "./QuillEditor";

export type TaskStatus = "Belum" | "Proses" | "Selesai";

export interface TaskFormData {
  judul: string;
  description: string;
  status: TaskStatus;
}

export interface TaskFormProps {
  /** Unique key untuk membedakan form add vs edit. Contoh: "add" atau "edit-42" */
  formId: string;
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const STORAGE_KEY = (formId: string) => `task_form_draft_${formId}`;

function getDefaultData(formId: string, initialData?: TaskFormData): TaskFormData {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY(formId));
    if (saved) {
      try {
        return JSON.parse(saved) as TaskFormData;
      } catch {
        // invalid JSON, abaikan
      }
    }
  }
  return initialData ?? { judul: "", description: "", status: "Belum" };
}

export function TaskForm({ formId, initialData, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(() =>
    getDefaultData(formId, initialData)
  );

  // Saat formId berubah (misal modal edit dibuka untuk task berbeda),
  // reset form dari localStorage atau dari initialData
  useEffect(() => {
    setFormData(getDefaultData(formId, initialData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  // Simpan ke localStorage setiap kali formData berubah
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY(formId), JSON.stringify(formData));
    }
  }, [formData, formId]);

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hapus draft setelah submit berhasil
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY(formId));
    }
    onSubmit(formData);
  };

  return (
    <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="judul">Title</Label>
        <Input
          id="judul"
          value={formData.judul}
          onChange={(e) => handleChange("judul", e.target.value)}
          required
          placeholder="Task title"
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <QuillEditor
          value={formData.description}
          onChange={(html) => handleChange("description", html)}
          placeholder="Task description…"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value as TaskStatus)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Belum">To Do (Belum)</option>
          <option value="Proses">In Progress (Proses)</option>
          <option value="Selesai">Done (Selesai)</option>
        </select>
      </div>
    </form>
  );
}
