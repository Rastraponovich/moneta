"use client";

import { Button, Dialog } from "@/shared/ui";

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function DeleteTransactionDialog({
  isOpen,
  onConfirm,
  onCancel,
  isPending = false,
}: DeleteTransactionDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      title="Подтверждение удаления"
      loading={isPending}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm();
        }}
        className="space-y-4"
      >
        <p className="text-gray-700">
          Вы уверены, что хотите удалить эту транзакцию? Это действие нельзя
          отменить.
        </p>
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="danger" className="flex-1" autoFocus>
            Удалить
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
          >
            Отмена
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
