import { Box, InputLabel, useTheme } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

export default function TableDetails({ ...props }) {
  const {
    field: { value, onChange },
  } = props;
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <>
      <InputLabel htmlFor="table-details__md-text-area" focused={focused}>
        {props.label ?? ""}
      </InputLabel>
      <Box
        data-color-mode={theme.palette.mode}
        sx={{
          color: "text.secondary",
          ...theme.typography.body2,
          "& .w-md-editor": {
            backgroundColor: `${theme.palette.action.input} !important`,
          },
          "& .w-md-editor-fullscreen": {
            backgroundColor: `${theme.palette.background.paper} !important`,
          },
          "& .w-md-editor-toolbar": {
            display: "flex",
            gap: 1,
          },
          "& .w-md-editor-toolbar > ul": {
            display: "flex",
            alignItems: "center",
          },
          "& .w-md-editor-toolbar > ul:first-of-type": {
            overflowX: "auto",
            marginRight: theme.spacing(1),
          },
          "& :is(h1, h2, h3, h4, h5, h6)": {
            marginY: `${theme.spacing(1.5)} !important`,
            borderBottom: "none !important",
          },
          "& details summary": {
            marginBottom: theme.spacing(1),
          },
        }}
      >
        <MDEditor
          style={{ margin: 1 }}
          preview="live"
          height={150}
          value={value}
          onChange={onChange}
          textareaProps={{
            id: "table-details__md-text-area",
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
          }}
          {...props}
        />
      </Box>
    </>
  );
}
