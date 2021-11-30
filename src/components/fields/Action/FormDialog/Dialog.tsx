import { FormDialog } from "@rowy/form-builder";
export default function ParamsDialog({
  column,
  handleRun,
  open,
  handleClose,
}: any) {
  if (!open) return null;
  return (
    <FormDialog
      onClose={handleClose}
      title={`${column.name as string}`}
      fields={column.config.params}
      values={{}}
      onSubmit={handleRun}
      SubmitButtonProps={{ children: "Run" }}
    />
  );
}
