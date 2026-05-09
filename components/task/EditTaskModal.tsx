"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { TaskForm, TaskFormData } from "./TaskForm";
import { Button } from "@/components/ui/button";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: TaskFormData) => void;
  initialData: TaskFormData | null;
  taskId: number | null;
}

export function EditTaskModal({
  isOpen,
  onClose,
  onEdit,
  initialData,
  taskId,
}: EditTaskModalProps) {
  const [formKey, setFormKey] = useState(0);

  const draftKey = taskId !== null ? `task_form_draft_edit-${taskId}` : null;

  const handleClose = () => {
    if (draftKey) localStorage.removeItem(draftKey);
    onClose();
  };

  const handleClearDraft = () => {
    if (draftKey) localStorage.removeItem(draftKey);
    setFormKey((k) => k + 1); // re-mount TaskForm → kembali ke initialData
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Task"
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
            Save Changes
          </Button>
        </>
      }
    >
      {initialData && taskId !== null ? (
        <TaskForm
          key={formKey}
          formId={`edit-${taskId}`}
          initialData={initialData}
          onSubmit={onEdit}
          onCancel={handleClose}
        />
      ) : (
        <div className="py-4 text-center text-sm text-gray-500">
          No task data provided.
        </div>
      )}
    </Modal>
  );
}
