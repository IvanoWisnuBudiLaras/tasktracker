import Modal from "@/components/Modal";
import { TaskForm, TaskFormData } from "./TaskForm";
import { Button } from "@/components/ui/button";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: TaskFormData) => void;
  initialData: TaskFormData | null;
}

export function EditTaskModal({ isOpen, onClose, onEdit, initialData }: EditTaskModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            Save Changes
          </Button>
        </>
      }
    >
      {initialData ? (
        <TaskForm initialData={initialData} onSubmit={onEdit} onCancel={onClose} />
      ) : (
        <div className="py-4 text-center text-sm text-gray-500">No task data provided.</div>
      )}
    </Modal>
  );
}
