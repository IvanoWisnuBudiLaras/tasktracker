import Modal from "@/components/Modal";
import { TaskForm, TaskFormData } from "./TaskForm";
import { Button } from "@/components/ui/button";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: TaskFormData) => void;
}

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Task"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            Add Task
          </Button>
        </>
      }
    >
      <TaskForm onSubmit={onAdd} onCancel={onClose} />
    </Modal>
  );
}
