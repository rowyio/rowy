import { useState } from "react";
import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import { ColorPicker, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

import { ButtonBase, Box, Collapse } from "@mui/material";

import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";

export default function Color({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();

  const [showPicker, setShowPicker] = useState(false);
  const toggleOpen = () => setShowPicker((s) => !s);

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <>
            <ButtonBase
              className={fieldClasses.root}
              onClick={() => {
                toggleOpen();
                onBlur();
              }}
              component={ButtonBase}
              focusRipple
              disabled={disabled}
              sx={{
                justifyContent: "flex-start",
                "&&": { pl: 0.75 },
                color: value?.hex ? "textPrimary" : "textSecondary",
              }}
            >
              <Box
                sx={{
                  backgroundColor: value?.hex,
                  width: 20,
                  height: 20,
                  mr: 2,
                  boxShadow: (theme) =>
                    `0 0 0 1px ${theme.palette.divider} inset`,
                  borderRadius: 0.5,
                }}
              />

              {value?.hex ?? "Choose a color…"}
            </ButtonBase>

            <Collapse
              in={showPicker}
              sx={{
                "& .rcp": {
                  borderRadius: 1,
                  boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider}`,
                  m: 1 / 8,
                },
                "& .rcp-saturation": {
                  borderRadius: 1,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
            >
              <ColorPicker
                width={240}
                height={180}
                color={value?.hex ? value : toColor("hex", "#fff")}
                onChange={onChange}
                alpha
              />
            </Collapse>
          </>
        );
      }}
    />
  );
}
