import { Controller, useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Stack, Link } from "@mui/material";

import ActionFab from "./ActionFab";
import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";
import { sanitiseCallableName, isUrl } from "@src/utils/fns";

export default function Action({
  column,
  control,
  docRef,
  disabled,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();

  const row = useWatch({ control });

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, value } }) => {
        const hasRan = value && value.status;

        return (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mr: -2 / 8 }}
          >
            <div
              className={fieldClasses.root}
              style={{
                flexGrow: 1,
                whiteSpace: "normal",
                width: "100%",
                overflow: "hidden",
              }}
            >
              {hasRan && isUrl(value.status) ? (
                <Link
                  href={value.status}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  underline="always"
                >
                  {value.status}
                </Link>
              ) : hasRan ? (
                value.status
              ) : (
                sanitiseCallableName(column.key)
              )}
            </div>

            <ActionFab
              row={{ ...row, ref: docRef }}
              column={{ config: column.config, key: column.key }}
              onSubmit={onChange}
              value={value}
              disabled={disabled}
            />
          </Stack>
        );
      }}
    />
  );
}
