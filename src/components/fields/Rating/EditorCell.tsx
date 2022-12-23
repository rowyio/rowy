import { useRef, useEffect } from "react";
import { IEditorCellProps } from "@src/components/fields/types";
import DisplayCell from "./DisplayCell";

export default function Rating({
  onChange,
  onSubmit,
  tabIndex,
  ...props
}: IEditorCellProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inputs = el.querySelectorAll("input");
    for (const input of inputs)
      input.setAttribute("tabindex", tabIndex.toString());
  }, [tabIndex]);

  return (
    <DisplayCell
      {...props}
      tabIndex={tabIndex}
      onChange={(_, newValue) => {
        onChange(newValue);
        onSubmit();
      }}
      ref={ref}
    />
  );
}
