import React from "react";
import { EditorProps } from "react-data-grid";

import {
  withStyles,
  WithStyles,
  createStyles,
  TextField,
} from "@material-ui/core";

import { FieldType } from "constants/fields";

const styles = (theme) =>
  createStyles({
    root: {
      width: "calc(100% - 1px)",
      height: "100%",

      background: theme.palette.background.paper,
      marginRight: 1,
    },

    inputBase: {
      padding: theme.spacing(0, 1.5),
      height: "100%",
      font: "inherit",
      letterSpacing: "inherit", // Prevent text jumping
    },
    input: {
      paddingBottom: theme.spacing(0.75), // Align baselines
      letterSpacing: "inherit", // Prevent text jumping
    },
  });

class TextEditor extends React.Component<
  EditorProps<any, any> & WithStyles<typeof styles>
> {
  constructor(props) {
    super(props);
  }

  inputRef = React.createRef<HTMLInputElement>();

  getInputNode() {
    return this.inputRef?.current;
  }

  getValue() {
    if ((this.props.column as any).type === FieldType.number)
      return Number(this.inputRef?.current?.value);

    if ((this.props.column as any).type === FieldType.percentage)
      return Number(this.inputRef?.current?.value) / 100;

    return this.inputRef?.current?.value;
  }

  render() {
    const { classes, column, value } = this.props;
    let inputType = "text";
    switch ((column as any).type) {
      case FieldType.email:
        inputType = "email";
        break;
      case FieldType.phone:
        inputType = "tel";
        break;
      case FieldType.url:
        inputType = "url";
        break;
      case FieldType.number:
      case FieldType.percentage:
        inputType = "number";
        break;

      default:
        break;
    }
    const { maxLength } = (column as any).config;
    return (
      <TextField
        defaultValue={
          (column as any).type === FieldType.percentage &&
          typeof value === "number"
            ? value * 100
            : value
        }
        type={inputType}
        fullWidth
        variant="standard"
        inputProps={{
          ref: this.inputRef,
          maxLength: maxLength,
        }}
        className={classes.root}
        InputProps={{
          classes: {
            root: classes.inputBase,
            input: classes.input,
          },
          endAdornment:
            (column as any).type === FieldType.percentage ? "%" : undefined,
        }}
      />
    );
  }
}

export default withStyles(styles)(TextEditor);
