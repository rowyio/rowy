import { useWatch } from "react-hook-form";
import { useAtom } from "jotai";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box, Stack, Typography, Avatar } from "@mui/material";
import { fieldSx } from "@src/components/SideDrawer/Form/utils";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";

export default function UpdatedBy({ control, column }: ISideDrawerFieldProps) {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const value = useWatch({
    control,
    name: tableSettings.auditFieldUpdatedBy || "_updatedBy",
  });

  if (!value || !value.displayName || !value.timestamp)
    return <Box sx={fieldSx} />;

  const dateLabel = format(
    value.timestamp.toDate ? value.timestamp.toDate() : value.timestamp,
    column.config?.format || DATE_TIME_FORMAT
  );

  return (
    <Stack direction="row" sx={[fieldSx, { alignItems: "flex-start" }]}>
      <Avatar
        alt="Avatar"
        src={value.photoURL}
        sx={{
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1.5,
          my: 0.5,
          fontSize: "inherit",
        }}
      >
        {value.displayName[0]}
      </Avatar>

      <Typography
        variant="body2"
        component="div"
        style={{ whiteSpace: "normal" }}
      >
        {value.displayName} ({value.email})
        <Typography variant="caption" color="textSecondary" component="div">
          Updated
          {value.updatedField && (
            <>
              {" "}
              field <code>{value.updatedField}</code>
            </>
          )}{" "}
          at {dateLabel}
        </Typography>
      </Typography>
    </Stack>
  );
}
