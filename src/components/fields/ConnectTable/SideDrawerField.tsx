import { useMemo } from "react";
import { useAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { find, isEqual } from "lodash-es";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Grid, Chip } from "@mui/material";

import ConnectTableSelect from "./ConnectTableSelect";
import { tableScope, tableRowsAtom } from "@src/atoms/tableScope";
import { getFieldId } from "@src/components/SideDrawer/utils";

export default function ConnectTable({
  column,
  _rowy_ref,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const [row] = useAtom(
    useMemo(
      () =>
        selectAtom(
          tableRowsAtom,
          (tableRows) => find(tableRows, ["_rowy_ref.path", _rowy_ref.path]),
          isEqual
        ),
      [_rowy_ref.path]
    ),
    tableScope
  );

  const config = column.config ?? {};

  const handleDelete = (docPath: string) => () => {
    if (column.config?.multiple === false) onChange(null);
    else onChange(value.filter((v: any) => v.docPath !== docPath));
    onSubmit();
  };

  return (
    <>
      {!disabled && (
        <ConnectTableSelect
          row={row}
          column={column}
          config={(config as any) ?? {}}
          value={value}
          onChange={onChange}
          TextFieldProps={{
            label: "",
            hiddenLabel: true,
            fullWidth: true,
            onBlur: onSubmit,
            id: getFieldId(column.key),
          }}
        />
      )}

      {value && (
        <Grid container spacing={0.5} style={{ marginTop: 2 }}>
          {Array.isArray(value) ? (
            value.map(({ snapshot, docPath }) => (
              <Grid item key={docPath}>
                <Chip
                  component="li"
                  label={column.config?.primaryKeys
                    ?.map((key: string) => snapshot[key])
                    .join(" ")}
                  onDelete={disabled ? undefined : handleDelete(docPath)}
                />
              </Grid>
            ))
          ) : value ? (
            <Grid item>
              <Chip
                component="li"
                label={column.config?.primaryKeys
                  ?.map((key: string) => value.snapshot[key])
                  .join(" ")}
                onDelete={disabled ? undefined : handleDelete(value.docPath)}
              />
            </Grid>
          ) : null}
        </Grid>
      )}
    </>
  );
}
