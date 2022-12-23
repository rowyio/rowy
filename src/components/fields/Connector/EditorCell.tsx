import { Suspense } from "react";
import { IEditorCellProps } from "@src/components/fields/types";

import PopupContents from "./Select/PopupContents";
import Loading from "@src/components/Loading";

export default function Connector({
  value,
  onChange,
  column,
  disabled,
  _rowy_ref,
}: IEditorCellProps) {
  return (
    <Suspense fallback={<Loading />}>
      <PopupContents
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        column={column}
        disabled={disabled}
        _rowy_ref={_rowy_ref}
      />
    </Suspense>
  );
}
