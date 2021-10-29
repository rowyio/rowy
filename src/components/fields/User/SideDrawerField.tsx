import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Stack, Typography, Avatar } from "@mui/material";
import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";

import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "@src/constants/dates";

export default function User({ control, column }: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { value } }) => {
        if (!value || !value.displayName || !value.timestamp)
          return <div className={fieldClasses.root} />;
        const dateLabel = value.timestamp
          ? format(
              value.timestamp.toDate
                ? value.timestamp.toDate()
                : value.timestamp,
              column.config?.format || DATE_TIME_FORMAT
            )
          : null;

        return (
          <Stack direction="row" className={fieldClasses.root}>
            <Avatar
              alt="Avatar"
              src={value.photoURL}
              sx={{ width: 32, height: 32, ml: -0.5, mr: 1.5, my: 0.5 }}
            />

            <Typography
              variant="body2"
              component="div"
              style={{ whiteSpace: "normal" }}
            >
              {value.displayName} ({value.email})
              {dateLabel && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  component="div"
                >
                  {dateLabel}
                </Typography>
              )}
            </Typography>
          </Stack>
        );
      }}
    />
  );
}
