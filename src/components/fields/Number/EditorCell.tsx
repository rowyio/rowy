import type { IEditorCellProps } from "@src/components/fields/types";
import EditorCellTextField from "@src/components/Table/TableCell/EditorCellTextField";

export default function Number_(props: IEditorCellProps<number | string>) {
  return (
    <EditorCellTextField
      {...(props as any)}
      InputProps={{ type: "number" }}
      onChange={(v) => {
        // Safari/Firefox gives us an empty string for invalid inputs, which includes inputs like "12." on the way to
        // typing "12.34". Number would cast these to 0 and replace the user's input to 0 whilst they're mid-way through
        // typing. We want to avoid that.
        const parsedValue = v === "" ? v : Number(v);
        props.onChange(parsedValue);
      }}
      onBlur={() => {
        // Cast to number when the user has finished editing
        props.onChange(Number(props.value));
        props.onDirty();
      }}
    />
  );
}
