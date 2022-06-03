import { Controller, useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box, Stack, Link } from "@mui/material";

import ActionFab from "./ActionFab";
import { fieldSx } from "@src/components/SideDrawer/utils";
import { sanitiseCallableName, isUrl } from "./utils";

export default function Action({
  column,
  control,
  docRef,
  disabled,
}: ISideDrawerFieldProps) {
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
            <Box
              sx={[
                fieldSx,
                {
                  flexGrow: 1,
                  whiteSpace: "normal",
                  width: "100%",
                  overflow: "hidden",
                },
              ]}
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
            </Box>

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
