import {
  FormControlLabel,
  FormControlLabelProps,
  Checkbox,
  CheckboxProps,
} from "@mui/material";

export interface ITutorialCheckboxProps {
  label: FormControlLabelProps["label"];
  checked: CheckboxProps["checked"];
  onChange: CheckboxProps["onChange"];
}

export default function TutorialCheckbox({
  checked,
  onChange,
  label,
}: ITutorialCheckboxProps) {
  return (
    <FormControlLabel
      label={label}
      sx={{
        ml: -6 / 8,
        mr: 0,

        "& .MuiFormControlLabel-label": {
          mt: ((36 - 20) / 2 + 1) / 8,
          // typography: "body1",
        },
      }}
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color="success"
          sx={{
            color: "success.light",
            p: 3 / 8,
            mr: 0.5,

            "& .checkbox-icon": {
              color: "success.light",
              borderRadius: "50%",
              borderWidth: 2,
              width: 24,
              height: 24,
              placeItems: "center",

              "& svg": {
                position: "relative",
                top: 1,
                left: 1,
              },

              "& .tick": {
                stroke: "currentColor",
              },
            },

            '& .checkbox-icon, &.Mui-checked .checkbox-icon, &[aria-selected="true"] .checkbox-icon':
              {
                backgroundColor: "transparent",
              },
          }}
        />
      }
    />
  );
}
