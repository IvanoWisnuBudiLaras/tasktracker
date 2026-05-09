"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { TaskForm, TaskFormData } from "./TaskForm";
import { Button } from "@/components/ui/button";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: TaskFormData) => void;
}

const DRAFT_KEY = "task_form_draft_add";

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  // Mengganti key memaksa TaskForm re-mount dan membaca ulang (sudah kosong)
  const [formKey, setFormKey] = useState(0);

  const handleClose = () => {
    localStorage.removeItem(DRAFT_KEY);
    onClose();
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormKey((k) => k + 1); // re-mount TaskForm → form kosong
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Task"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            className="mr-auto text-xs text-muted-foreground hover:text-destructive"
            onClick={handleClearDraft}
            type="button"
          >
            Hapus Draft
          </Button>
          <Button variant="outline" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            Add Task
          </Button>
        </>
      }
    >
      <TaskForm key={formKey} formId="add" onSubmit={onAdd} onCancel={handleClose} />
    </Modal>
  );
}
