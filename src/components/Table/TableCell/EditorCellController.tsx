import { useEffect, useLayoutEffect } from "react";
import useStateRef from "react-usestateref";
import { useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import { useSnackbar } from "notistack";

import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import type {
  IDisplayCellProps,
  IEditorCellProps,
} from "@src/components/fields/types";

interface IEditorCellControllerProps extends IDisplayCellProps {
  EditorCellComponent: React.ComponentType<IEditorCellProps>;
  parentRef: IEditorCellProps["parentRef"];
  saveOnUnmount: boolean;
}

/**
 * Stores a local state for the cell’s value, so that `EditorCell` doesn’t
 * immediately update the database when the user quickly makes changes to the
 * cell’s value (e.g. text input).
 *
 * Extracted from `withRenderTableCell()` so when the `DisplayCell` is
 * rendered, an unnecessary extra state is not created.
 *
 * - Defines function to update the field in db
 * - Tracks when the user has made the input “dirty”
 * - By default, saves to db when the component is unmounted and the input
 *   is dirty
 * - Has an effect to change the local value state when it receives an update
 *   from db and the field is not dirty. This is required to make inline
 *   `EditorCell` work when they haven’t been interacted with, but prevent the
 *   value changing while someone is editing a field, like Long Text.
 */
export default function EditorCellController({
  EditorCellComponent,
  saveOnUnmount,
  value,
  ...props
}: IEditorCellControllerProps) {
  // Store local value so we don’t immediately write to db when the user
  // types in a textbox, for example
  const [localValue, setLocalValue, localValueRef] = useStateRef(value);
  // Mark if the user has interacted with this cell and hasn’t saved yet
  const [isDirty, setIsDirty, isDirtyRef] = useStateRef(false);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const { enqueueSnackbar } = useSnackbar();

  // When this cell’s data has updated, update the local value if
  // it’s not dirty and the value is different
  useEffect(() => {
    if (!isDirty && !isEqual(value, localValueRef.current))
      setLocalValue(value);
  }, [isDirty, localValueRef, setLocalValue, value]);

  // This is where we update the documents
  const handleSubmit = async () => {
    // props.disabled should always be false as withRenderTableCell would
    // render DisplayCell instead of EditorCell
    if (props.disabled || !isDirtyRef.current) return;
    try {
      await updateField({
        path: props._rowy_ref.path,
        fieldName: props.column.fieldName,
        value: localValueRef.current,
        deleteField: localValueRef.current === undefined,
        arrayTableData: props.row?._rowy_ref.arrayTableData,
      });
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: "error" });
    }
  };

  useLayoutEffect(() => {
    return () => {
      if (saveOnUnmount) handleSubmit();
    };
    // Warns that `saveOnUnmount` and `handleSubmit` should be included, but
    // those don’t change across re-renders. We only want to run this on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditorCellComponent
      {...props}
      value={localValue}
      onDirty={(dirty?: boolean) => setIsDirty(dirty ?? true)}
      onChange={(v) => {
        setIsDirty(true);
        setLocalValue(v);
      }}
      onSubmit={handleSubmit}
    />
  );
}
