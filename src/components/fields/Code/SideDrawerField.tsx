import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import CodeEditor from "components/CodeEditor";
import { makeStyles, createStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      border: "1px solid",
      borderColor:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",

      borderRadius: theme.shape.borderRadius,
      overflow: "hidden",
    },
  })
);

export default function Code({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const classes = useStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, value } }) => (
        <CodeEditor
          disabled={disabled}
          value={value}
          onChange={onChange}
          wrapperProps={{ className: classes.wrapper }}
          editorOptions={{
            minimap: {
              enabled: false,
            },
          }}
        />
      )}
    />
  );
}
