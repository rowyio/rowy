import clsx from "clsx";
import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import {
  makeStyles,
  createStyles,
  ButtonBase,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

import { useFieldStyles } from "components/SideDrawer/Form/utils";
import { useSwitchStyles } from "./styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { padding: 0 },

    formControlLabel: {
      margin: 0,
      width: "100%",
      display: "flex",

      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),
    },

    label: {
      flexGrow: 1,
      whiteSpace: "normal",
    },
  })
);

export default function Checkbox({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const classes = useStyles();
  const fieldClasses = useFieldStyles();
  const switchClasses = useSwitchStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.checked);
        };

        return (
          <ButtonBase
            className={clsx(fieldClasses.root, classes.root)}
            disabled={disabled}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={value}
                  onChange={handleChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  classes={switchClasses}
                />
              }
              label={column.name}
              labelPlacement="start"
              classes={{ root: classes.formControlLabel, label: classes.label }}
            />
          </ButtonBase>
        );
      }}
    />
  );
}
