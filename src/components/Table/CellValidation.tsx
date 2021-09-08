import { styled } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import WarningIcon from "@material-ui/icons/WarningAmber";

import RichTooltip from "components/RichTooltip";

const Root = styled(Box)({
  width: "100%",
  height: "100%",
  padding: "var(--cell-padding)",
  position: "relative",

  overflow: "hidden",
  contain: "strict",
  display: "flex",
  alignItems: "center",
});

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
}: // ...props
ICellValidationProps) {
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

        <Root
          // {...props}
          sx={{
            boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.error.main}`,
          }}
        >
          {children}
        </Root>
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

        <Root
          // {...props}
          sx={{
            boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.error.main}`,
          }}
        >
          {children}
        </Root>
      </>
    );

  return (
    <Root
    // {...props}
    >
      {children}
    </Root>
  );
}
