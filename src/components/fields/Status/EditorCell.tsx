import { IEditorCellProps } from "@src/components/fields/types";
import MultiSelectComponent from "@rowy/multiselect";

export default function StatusSingleSelect({
  value,
  onChange,
  onSubmit,
  column,
  parentRef,
  showPopoverCell,
  disabled,
}: IEditorCellProps) {
  const config = column.config ?? {};
  const conditions = config.conditions ?? [];
  /**Revisit eventually, can we abstract or use a helper function to clean this? */
  const reMappedConditions = conditions.map((c: any) => {
    let rValue = { ...c };
    if (c.type === "number") {
      if (c.operator === "<") rValue = { ...c, value: c.value - 1 };
      if (c.operator === ">") rValue = { ...c, value: c.value + 1 };
    }
    return rValue;
  });
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <MultiSelectComponent
      value={value}
      onChange={(v) => onChange(v)}
      options={conditions.length >= 1 ? reMappedConditions : []} // this handles when conditions are deleted
      multiple={false}
      freeText={config.freeText}
      disabled={disabled}
      label={column.name as string}
      labelPlural={column.name as string}
      TextFieldProps={{
        style: { display: "none" },
        SelectProps: {
          open: true,
          MenuProps: {
            anchorEl: parentRef,
            anchorOrigin: { vertical: "bottom", horizontal: "center" },
            transformOrigin: { vertical: "top", horizontal: "center" },
            sx: {
              "& .MuiPaper-root": { minWidth: `${column.width}px !important` },
            },
          },
        },
      }}
      onClose={() => {
        showPopoverCell(false);
        onSubmit();
      }}
    />
  );
}
