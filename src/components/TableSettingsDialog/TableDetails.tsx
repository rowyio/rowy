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
        sx={{
          "& .w-md-editor": {
            backgroundColor: `${theme.palette.action.input} !important`,
          },
          "& .w-md-editor-fullscreen": {
            backgroundColor: `${theme.palette.background.paper} !important`,
          },
        }}
      >
        <MDEditor
          style={{ margin: 1 }}
          preview="live"
          toolbarHeight={52}
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
