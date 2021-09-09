import { styled } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import WarningIcon from "@material-ui/icons/WarningAmber";

import RichTooltip from "components/RichTooltip";

const Root = styled("div")(({ theme, ...props }) => ({
  width: "100%",
  height: "100%",
  padding: "var(--cell-padding)",
  position: "relative",

  overflow: "hidden",
  contain: "strict",
  display: "flex",
  alignItems: "center",

  ...((props as any).error
    ? {
        ".rdg-cell:not([aria-selected=true]) &": {
          boxShadow: `inset 0 0 0 2px ${theme.palette.error.main}`,
        },
      }
    : {}),
}));

const Dot = styled("div")(({ theme }) => ({
  position: "absolute",
  right: -5,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,

  width: 12,
  height: 12,

  borderRadius: "50%",
  backgroundColor: theme.palette.error.main,

  boxShadow: `0 0 0 4px var(--background-color)`,
  ".rdg-row:hover &": {
    boxShadow: `0 0 0 4px var(--row-hover-background-color)`,
  },
}));

export interface ICellValidationProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  value: any;
  required?: boolean;
  validationRegex?: string;
}

export default function CellValidation({
  value,
  required,
  validationRegex,
  children,
}: ICellValidationProps) {
  const isInvalid = validationRegex && !new RegExp(validationRegex).test(value);
  const isMissing = required && value === undefined;

  if (isInvalid)
    return (
      <>
        <RichTooltip
          icon={<ErrorIcon fontSize="inherit" color="error" />}
          title="Invalid Data"
          message="This row will not be saved until all the required fields contain valid data"
          placement="right"
          render={({ openTooltip }) => <Dot onClick={openTooltip} />}
        />

        <Root {...({ error: true } as any)}>{children}</Root>
      </>
    );

  if (isMissing)
    return (
      <>
        <RichTooltip
          icon={<WarningIcon fontSize="inherit" color="warning" />}
          title="Required Field"
          message="This row will not be saved until all the required fields contain valid data"
          placement="right"
          render={({ openTooltip }) => <Dot onClick={openTooltip} />}
        />

        <Root {...({ error: true } as any)}>{children}</Root>
      </>
    );

  return <Root>{children}</Root>;
}
